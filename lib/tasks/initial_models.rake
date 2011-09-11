
desc "Initialize models"
namespace :forgecraft do

  task :reset => :environment do
    require 'initial_models'
    ForgeCraft::InitialModels.reset
  end
  
  task :initialize => :environment do
    require 'initial_models'
    ForgeCraft::InitialModels.create
  end

  task :reinit => :environment do
    require 'initial_models'
    ForgeCraft::InitialModels.reset
    ForgeCraft::InitialModels.create
  end

end