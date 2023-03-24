import PotentialLearning

# New function to read XYZ files ###############################################
include("xyz.jl")


# New functions to get input parameters from OrderedDict #######################

"""
    to_num(str)
    
`str`: string with a number: integer or float

Returns an integer or float.

"""
function to_num(str)
    val = nothing
    if occursin(".", str)
        val = parse(Float64, str)
    else
        val = parse(Int64, str)
    end
    return val
end


"""
    get_input(args)
    
`args`: vector of arguments (strings)

Returns an OrderedDict with the arguments.
See https://github.com/cesmix-mit/AtomisticComposableWorkflows documentation
for information about how to define the input arguments.

"""
function get_input(args)
    input = OrderedDict()
    for (key, val) in partition(args,2,2)
        val = replace(val, " " => "")
        # if val is a boolean
        if val == "true" || val == "false"
            val = val == "true"
        # if val is a vector, e.g. "[1.5,1.5]"
        elseif val[1] == '['
            val = to_num.(split(val[2:end-1], ","))
        # if val is a number, e.g. 1.5 or 1
        elseif tryparse(Float64, val) != nothing
            val = to_num(val)
        end
        input[key] = val
    end
    return input
end


# New function to Split datasets ###############################################

function Base.split(ds, n, m)
    ii = randperm(length(ds))
    return @views ds[first(ii, n)], ds[last(ii, m)]
end

# New functions to reduce dimension of dataset descriptors #####################
# TODO: adapt these functions to current interfaces

function fit_pca(d, tol)
    m = [mean(d[:,i]) for i in 1:size(d)[2]]
    dc = reduce(hcat,[d[:,i] .- m[i] for i in 1:size(d)[2]])
    Q = Symmetric(mean(dc[i,:]*dc[i,:]' for i in 1:size(dc,1)))
    λ, ϕ = eigen(Q)
    λ, ϕ = λ[end:-1:1], ϕ[:, end:-1:1] # reorder by column
    Σ = 1.0 .- cumsum(λ) / sum(λ)
    W = ϕ[1:tol, :] # W = ϕ[:, Σ .> tol]
    return λ, W, m
end

function get_dim_red_pars(ds, tol)
    lll = get_values.(get_local_descriptors.(ds))
    lll_mat = Matrix(hcat(vcat(lll...)...)')
    λ_l, W_l, m_l = fit_pca(lll_mat, tol)

    fff = get_values.(get_force_descriptors.(ds))
    fff_mat = Matrix(hcat(vcat(vcat(fff...)...)...)')
    λ_f, W_f, m_f = fit_pca(fff_mat, tol)

    return λ_l, W_l, m_l, lll, λ_f, W_f, m_f, fff
end

function reduce_desc(λ_l, W_l, m_l, lll, λ_f, W_f, m_f, fff)
    e_descr = [LocalDescriptors([((l .- m_l)' * W_l')' for l in ll ]) for ll in lll]
    f_descr = [ForceDescriptors([[((fc .- m_f)' * W_f')' for fc in f] for f in ff]) for ff in fff]
    return e_descr, f_descr
end


# LBasisPotential is not exported in InteratomicBasisPotentials.jl / basis_potentials.jl
# These functions should be removed once export issue is fixed.
struct LBasisPotential
    basis
    β
end
function LBasisPotential(basis)
    return LBasisPotential(basis, zeros(length(basis)))
end


# New learning function based on weigthed least squares ########################
function learn!(lb::LBasisPotential, ds::DataSet; w_e = 1.0, w_f = 1.0)

    lp = PotentialLearning.LinearProblem(ds)
    
    @views B_train = reduce(hcat, lp.B)'
    @views dB_train = reduce(hcat, lp.dB)'
    @views e_train = lp.e
    @views f_train = reduce(vcat, lp.f)
    
    # Calculate A and b.
    @views A = [B_train; dB_train]
    @views b = [e_train; f_train]

    # Calculate coefficients β.
    Q = Diagonal([w_e * ones(length(e_train));
                  w_f * ones(length(f_train))])
    β = (A'*Q*A) \ (A'*Q*b)

    #copyto!(lp.β, β)
    #copyto!(lp.σe, w_e)
    #copyto!(lp.σf, w_f)
    copyto!(lb.β, β)
end

# Auxiliary functions to compute all energies and forces as vectors (Zygote-friendly functions)

function get_all_energies(ds::DataSet)
    return [get_values(get_energy(ds[c])) for c in 1:length(ds)]
end

function get_all_forces(ds::DataSet)
    return reduce(vcat,reduce(vcat,[get_values(get_forces(ds[c]))
                                    for c in 1:length(ds)]))
end

function get_all_energies(ds::DataSet, lb::LBasisPotential)
    Bs = sum.(get_values.(get_local_descriptors.(ds)))
    return dot.(Bs, [lb.β])
end

function get_all_forces(ds::DataSet, lb::LBasisPotential)
    force_descriptors = [reduce(vcat, get_values(get_force_descriptors(dsi)) ) for dsi in ds]
    return vcat([dB' * lb.β for dB in [reduce(hcat, fi) for fi in force_descriptors]]...)
end


# Definition of a linear problem. Changes descriptors calculations (only one line)
"""
    LinearProblem(ds::DatasSet; T = Float64)

Construct a LinearProblem by detecting if there are energy descriptors and/or force descriptors and construct the appropriate LinearProblem (either Univariate, if only a single type of descriptor, or Covariate, if there are both types).
"""
function PotentialLearning.LinearProblem(ds::DataSet; T = Float64)
    d_flag, descriptors, energies = try
        #true,  compute_features(ds, GlobalSum()), get_values.(get_energy.(ds))
        true, sum.(get_values.(get_local_descriptors.(ds))), get_values.(get_energy.(ds))
        
        #true, compute_feature.(get_local_descriptors.(ds), [GlobalSum()]), get_values.(get_energy.(ds))
    catch 
        false, 0.0, 0.0 
    end
    fd_flag, force_descriptors, forces = try  
        true, [reduce(vcat, get_values(get_force_descriptors(dsi)) ) for dsi in ds], get_values.(get_forces.(ds))
    catch
        false, 0.0, 0.0
    end
    if d_flag & ~fd_flag 
        dim = length(descriptors[1])
        β = zeros(T, dim)

        p = UnivariateLinearProblem(descriptors, 
                energies, 
                β, 
                [1.0],
                Symmetric(zeros(dim, dim)))
    elseif ~d_flag & fd_flag 
        dim = length(force_descriptors[1][1])
        β = zeros(T, dim)

        force_descriptors = [reduce(hcat, fi) for fi in force_descriptors]
        p = UnivariateLinearProblem(force_descriptors,
            [reduce(vcat, fi) for fi in forces], 
            β, 
            [1.0], 
            Symmetric(zeros(dim, dim))
        )
        
    elseif d_flag & fd_flag 
        dim_d = length(descriptors[1])
        dim_fd = length(force_descriptors[1][1])

        if  (dim_d != dim_fd) 
            error("Descriptors and Force Descriptors have different dimension!") 
        else
            dim = dim_d
        end

        β = zeros(T, dim)
        forces =  [reduce(vcat, fi) for fi in forces]
        force_descriptors = [reduce(hcat, fi) for fi in force_descriptors]

        p = PotentialLearning.CovariateLinearProblem(energies,
                [reduce(vcat, fi) for fi in forces], 
                descriptors, 
                force_descriptors, 
                β, 
                [1.0], 
                [1.0], 
                Symmetric(zeros(dim, dim)))

    else 
        error("Either no (Energy, Descriptors) or (Forces, Force Descriptors) in DataSet")
    end
    p
end





## Dont erase


# λ_pca, W_pca = fit(ds_train_1, PCA()) # Current implementation

#using MultivariateStats, Statistics
#s = open("a-Hfo2-300K-NVT-6000-NACE/locdesc.dat") do file
#    read(file, String)
#end
#a = eval(Meta.parse(s))
#b = reduce(hcat,[a[:,i] .- mean(a[:,i]) for i in 1:size(a)[2]])
#M = MultivariateStats.fit(MultivariateStats.PCA, c)
#R = predict(M, c)


#using MultivariateStats, Statistics
#a = vcat(get_values.(get_local_descriptors.(ds_train_1))...)
#b = Matrix(hcat(vcat(get_values.(get_local_descriptors.(ds_train_1))...)...)')
##c = reduce(hcat,[b[:,1] .- mean(b[:,1]) for i in 1:size(b)[2]])

#Q = Symmetric(mean(di*di' for di in foreachrow(a)))

#using LinearAlgebra

#Qa = Symmetric(Symmetric(mean(a[i,:]*a[i,:]' for i in 1:size(a,1))))
#Qc = Symmetric(Symmetric(mean(c[i,:]*c[i,:]' for i in 1:size(c,1))))

#λ, ϕ = eigen(Qa)
#λ, ϕ = λ[end:-1:1], ϕ[end:-1:1, :] # reorder

#Σ = 1.0 .- cumsum(λ) / sum(λ)
#tol = 0.00001
#W = ϕ[Σ .> tol, :]
#λ, W
