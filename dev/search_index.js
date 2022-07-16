var documenterSearchIndex = {"docs":
[{"location":"api/#API-Reference","page":"API","title":"API Reference","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"This page provides a list of all documented types and functions and in PotentialLearning.jl.","category":"page"},{"location":"api/","page":"API","title":"API","text":"Modules = [PotentialLearning]\nOrder   = [:type, :function, :constant]","category":"page"},{"location":"api/#PotentialLearning.NNBasisPotential","page":"API","title":"PotentialLearning.NNBasisPotential","text":"NNBasisPotential\n\nDefinition of the neural network basis potential composed type.\n\n\n\n\n\n","category":"type"},{"location":"api/#PotentialLearning.batch_train_flux!-NTuple{8, Any}","page":"API","title":"PotentialLearning.batch_train_flux!","text":"batch_train_flux!(ps, re, opt, maxiters, train_loader_e, train_loader_f, w_e, w_f)\n\nps: neural network parameters. See Flux.destructure. re: neural network restructure. See Flux.destructure. opt: optimizer. maxiters: maximum number of iterations in the optimizer. train_loader_e: energy data loader. train_loader_f: force data loader. w_e: energy weight. w_f: force weight.\n\nBatch training using Flux.jl. Returns neural network parameters.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.batch_train_opt!-NTuple{10, Any}","page":"API","title":"PotentialLearning.batch_train_opt!","text":"batch_train_opt!(ps, re, opt, maxiters, train_loader_e, train_loader_f,\n                 w_e, w_f, epoch, train_losses_batches)\n\nps: neural network parameters. See Flux.destructure. re: neural network restructure. See Flux.destructure. opt: optimizer. maxiters: maximum number of iterations in the optimizer. train_loader_e: energy data loader. train_loader_f: force data loader. w_e: energy weight. w_f: force weight. epoch: current epoch. train_losses_batches: vector of batch losses during training.\n\nBatch training using Optimization.jl. Returns NN parameters.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.calc_metrics-Tuple{Any, Any}","page":"API","title":"PotentialLearning.calc_metrics","text":"calc_metrics(x_pred, x)\n\nx_pred: vector of predicted values of a variable. E.g. energy. x: vector of true values of a variable. E.g. energy.\n\nReturns MAE, RMSE, and RSQ.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.force-Tuple{AtomsBase.AbstractSystem, PotentialLearning.NNBasisPotential}","page":"API","title":"PotentialLearning.force","text":"force(A::AbstractSystem, p::NNBasisPotential)\n\nA: atomic system or atomic configuration. p: neural network basis potential.\n\nReturns the force of a system using a neural network basis potential.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.force-Tuple{Vector, Vector, PotentialLearning.NNBasisPotential}","page":"API","title":"PotentialLearning.force","text":"force(b::Vector, dbdr::Vector, p::NNBasisPotential)\n\nb: energy descriptors of a system. dbdr: force descriptors of a system. p: neural network basis potential.\n\nReturns the force of a system using a neural network basis potential.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.force-Tuple{Vector, Vector, Vector, Any}","page":"API","title":"PotentialLearning.force","text":"force(b::Vector, dbdr::Vector, ps::Vector, re)\n\nb: energy descriptors of a system. dbdr: force descriptors of a system. ps: neural network parameters. See Flux.destructure. re: neural network restructure. See Flux.destructure.\n\nReturns the force of a system using a neural network basis potential.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.get_batches-NTuple{11, Any}","page":"API","title":"PotentialLearning.get_batches","text":"get_batches(n_batches, B_train, B_train_ext, e_train, dB_train, f_train,\n            B_test, B_test_ext, e_test, dB_test, f_test)\n\nn_batches: no. of batches per dataset. B_train: descriptors of the energies used in training. B_train_ext: extendended descriptors of the energies used in training. Requiered to compute forces. e_train: energies used in training. dB_train: derivatives of the energy descritors used in training. f_train: forces used in training. B_test: descriptors of the energies used in test. B_test_ext: extendended descriptors of the energies used in test. Requiered to compute forces. e_test: energies used in test. dB_test: derivatives of the energy descritors used in test. f_test: forces used in test.\n\nReturns the data loaders for training and test of energies and forces.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.get_input-Tuple{Any}","page":"API","title":"PotentialLearning.get_input","text":"get_input(args)\n\nargs: vector of arguments (strings)\n\nReturns an OrderedDict with the arguments. See https://github.com/cesmix-mit/AtomisticComposableWorkflows documentation for information about how to define the input arguments.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.get_metrics-NTuple{11, Any}","page":"API","title":"PotentialLearning.get_metrics","text":"get_metrics( e_train_pred, e_train, f_train_pred, f_train,\n             e_test_pred, e_test, f_test_pred, f_test,\n             B_time, dB_time, time_fitting)\n\ne_train_pred: vector of predicted training energy values. e_train: vector of true training energy values. f_train_pred: vector of predicted training force values. f_train: vector of true training force values. e_test_pred: vector of predicted test energy values. e_test: vector of true test energy values. f_test_pred: vector of predicted test force values. f_test: vector of true test force values. B_time: elapsed time consumed by descriptors calculation. dB_time: elapsed time consumed by descriptor derivatives calculation. time_fitting: elapsed time consumed by fitting process.\n\nComputes MAE, RMSE, and RSQ for training and testing energies and forces. Also add elapsed times about descriptors and fitting calculations. Returns an OrderedDict with the information above.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.global_loss-NTuple{6, Any}","page":"API","title":"PotentialLearning.global_loss","text":"global_loss(loader_e, loader_f, w_e, w_f, ps, re)\n\nloader_e: preditected energies loader_f: energies w_e: energy weight w_f: force weight ps: neural network parameters. See Flux.destructure. re: neural network restructure. See Flux.destructure.\n\nReturns the weighted global (all bacthes) loss of the energies and forces.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.grad_mlp-Tuple{Any, Any}","page":"API","title":"PotentialLearning.grad_mlp","text":"grad_mlp(nn_params, x0)\n\nnn_params: neural network parameters. x0: first layer input (energy descriptors).\n\nReturns the analytical derivative of a feedforward neural network.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.learn-NTuple{6, Any}","page":"API","title":"PotentialLearning.learn","text":"learn(B_train, dB_train, e_train, f_train, w_e, w_f)\n\nB_train: energy descriptors. dB_train: force descriptors. e_train: training energies. f_train: training forces. w_e: energy weight. w_f: force weight.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.linearize_forces-Tuple{Any}","page":"API","title":"PotentialLearning.linearize_forces","text":"linearize_forces(forces)\n\nforces: vector of forces per system\n\nReturns a vector with the components of the forces of the systems.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.load_dataset-NTuple{4, Any}","page":"API","title":"PotentialLearning.load_dataset","text":"load_dataset(n_train_sys, n_test_sys, dataset_path, dataset_filename)\n\nn_train_sys: no. of training systems n_test_sys: no. of test systems dataset_path: dataset path dataset_filename: dataset filename\n\nReturns training and test energies, forces, and stresses. The input dataset is split into training and test datasets.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.load_dataset-NTuple{5, Any}","page":"API","title":"PotentialLearning.load_dataset","text":"load_dataset(n_train_sys, n_test_sys, dataset_path,\n             trainingset_filename, testset_filename)\n\nn_train_sys: no. of training systems n_test_sys: no. of test systems dataset_path: datasets path trainingset_filename: training dataset filename testset_filename: test dataset filename\n\nReturns training and test energies, forces, and stresses. Training and test datasets are already defined.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.load_dataset-Tuple{Any}","page":"API","title":"PotentialLearning.load_dataset","text":"load_dataset(input)\n\ninput: OrderedDict with input arguments. See get_defaults_args().\n\nReturns training and test energies, forces, and stresses.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.load_extxyz-Tuple{Any}","page":"API","title":"PotentialLearning.load_extxyz","text":"load_extxyz(file; max_entries = 2000, T = Float64)\n\nfile: name of extxyz file max_entries: maximum number of systems T: default type\n\nReturns a vector of systems or atomic configurations.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.loss-NTuple{6, Any}","page":"API","title":"PotentialLearning.loss","text":"loss(es_pred, es, w_e, fs_pred, fs, w_f)\n\nes_pred: preditected energies es: energies w_e: energy weight fs_pred: preditected forces fs: forces w_f: force weight\n\nReturns the weighted loss of the energies and forces using MSE.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.plot_cos-Tuple{Any, Any}","page":"API","title":"PotentialLearning.plot_cos","text":"plot_cos(f_pred, f_true)\n\nf_pred: vector of predicted forces f_true: vector of true forces\n\nReturns a plot with the cosine or correlation of the forces.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.plot_energy-Tuple{Any, Any}","page":"API","title":"PotentialLearning.plot_energy","text":"plot_energy(e_pred, e_true)\n\ne_pred: vector of predicted energies e_true: vector of true energies\n\nReturns an energy plot.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.plot_forces-Tuple{Any, Any}","page":"API","title":"PotentialLearning.plot_forces","text":"plot_forces(f_pred, f_true)\n\nf_pred: vector of predicted forces f_true: vector of true forces\n\nReturns a force plot.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.potential_energy-Tuple{AtomsBase.AbstractSystem, PotentialLearning.NNBasisPotential}","page":"API","title":"PotentialLearning.potential_energy","text":"potential_energy(A::AbstractSystem, p::NNBasisPotential)\n\nA: atomic system or atomic configuration. p: neural network basis potential.\n\nReturns the potential energy of a system using a neural network basis potential.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.potential_energy-Tuple{Vector, PotentialLearning.NNBasisPotential}","page":"API","title":"PotentialLearning.potential_energy","text":"potential_energy(b::Vector, p::NNBasisPotential)\n\nb: vector of energy descriptors. p: neural network basis potential.\n\nReturns the potential energy of a system using a neural network basis potential.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.potential_energy-Tuple{Vector, Vector, Any}","page":"API","title":"PotentialLearning.potential_energy","text":"potential_energy(b::Vector, ps::Vector, re)\n\nb: energy descriptors of a system. ps: neural network parameters. See Flux.destructure. re: neural network restructure. See Flux.destructure.\n\nReturns the potential energy of a system using a neural network basis potential.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.to_num-Tuple{Any}","page":"API","title":"PotentialLearning.to_num","text":"to_num(str)\n\nstr: string with a number: integer or float\n\nReturns an integer or float.\n\n\n\n\n\n","category":"method"},{"location":"api/#PotentialLearning.train!-NTuple{11, Any}","page":"API","title":"PotentialLearning.train!","text":"train!( lib, nnbp, epochs, opt, maxiters, train_loader_e, train_loader_f,\n        test_loader_e, test_loader_f, w_e, w_f)\n\nlib: nnbp:   epochs: no. of epochs. opt: optimizer. maxiters: maximum number of iterations in the optimizer. train_loader_e: energy data loader for training. train_loader_f: force data loader for training. test_loader_e: energy data loader for test. test_loader_f: force data loader for test. w_e: energy weight. w_f: force weight.\n\nTrain neural network potential. Returns losses of training and test per epoch and per batch.\n\n\n\n\n\n","category":"method"},{"location":"#[WIP]-PotentialLearning.jl","page":"Home","title":"[WIP] PotentialLearning.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"An open source Julia library for active learning of interatomic potentials in atomistic simulations of materials. It incorporates elements of bayesian inference, machine learning, differentiable programming,  software composability, and high-performance computing. This package is part of a software suite developed for the CESMIX project.","category":"page"},{"location":"#Specific-goals","page":"Home","title":"Specific goals","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Intelligent data subsampling: iteratively query a large pool of unlabeled data to extract a minimum number of training data that would lead to a supervised ML model with superior accuracy compared to a training model with educated handpicking.\nVia DPP. See this presentation.\nVia clustering. See this proposal.\nInteratomic potential hyper-parameter optimization. E.g. estimaing optimal cutoff radiuos.\nMeasurement of QoI sensitivity to individual parameters. \nInference of the optimal values and uncertainties of the model parameters, to propagate them through the atomistic simulation.\nInteratomic potential fitting. The potentials addressed in this package are defined in InteratomicPotentials.jl and InteratomicBasisPotentials.jl. E.g. ACE, SNAP, Neural Network Potentials.\nInput data management and post-processing.\nProcess input data so that it is ready for training. E.g. read XYZ file with atomic configurations, linearize energies and forces, split dataset into training and testing, normalize data, transfer data to GPU, define iterators, etc.\nPost-processing: computation of different metrics (MAE, RSQ, COV, etc), saving results, and plotting.","category":"page"},{"location":"#Leveraging-Julia!","page":"Home","title":"Leveraging Julia!","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Software composability through multiple dispatch. A series of composable workflows. is guiding our design and development. We analyzed three of the most representative workflows: classical molecular dynamics (MD), Ab initio MD, and classical MD with active learning. In addition, it facilitates the training of new  potentials defined by the composition of neural networks with state-of-the-art interatomic potential descriptors.\nDifferentiable programming. Powerful automatic differentiation tools, such as Enzyme or Zygote, help to accelerate the development of new interatomic potentials by automatically calculating loss function gradients and forces.\nSciML: Open Source Software for Scientific Machine Learning. It provides libraries, such as Optimization.jl, that bring together several optimization packages into one unified Julia interface. \nMachine learning and HPC abstractions: Flux.jl makes parallel learning simple using the NVIDIA GPU abstractions of CUDA.jl. Mini-batch iterations on heterogeneous data, as required by a loss function based on energies and forces, can be handled by DataLoader.jl.","category":"page"},{"location":"#Examples","page":"Home","title":"Examples","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"See AtomisticComposableWorkflows.","category":"page"}]
}
