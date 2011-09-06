require 'test_helper'

class OreTest < ActiveSupport::TestCase
  
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :rank

end
