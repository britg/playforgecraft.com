require 'test_helper'

class EnemyTest < ActiveSupport::TestCase
  
  should validate_presence_of :name
  should validate_uniqueness_of :name

  setup do
    @enemy = Fabricate(:enemy)
  end
  
end
