ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

# Shoulda looks for RAILS_ROOT before loading shoulda/rails, and Rails 3.1
# doesn't have that anymore.
require 'shoulda/rails'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.(yml|csv) for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  #fixtures :all

  # Add more helper methods to be used by all tests here...

  def bootstrap_ores
    Ore::DEFAULTS.each_with_index do |t, i|
      Fabricate(:ore, :name => t, :rank => i)
    end
  end

  def bootstrap_rarities
    Rarity::DEFAULTS.each_with_index do |r, i|
      Fabricate :rarity, :name => r, :rank => i
    end
  end

  def bootstrap_hero_classes
    HeroClass::CLASSES.each do |hero_class|
      Fabricate hero_class
    end
  end

  def bootstrap_classifications
    Classification::DEFAULTS.each do |genre, class_names|
      class_names.each do |class_name|
        Fabricate(:classification, :name => class_name)
      end
    end
  end

  def bootstrap_loot
    bootstrap_classifications
    loot = {}
    Classification.all.each do |classification|
      item = Fabricate :item, :classification => classification
      loot[classification.name] = Fabricate :loot, :item => item
    end
    return loot
  end
  
end

class ActionController::TestCase
  include Devise::TestHelpers
end
