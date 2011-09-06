
desc "Initialize models"
namespace :forgecraft do
  task :initialize => :environment do
    require 'initial_models'
    ForgeCraft::InitialModels.create
  end
end