require 'test_helper'

class GenreTest < ActiveSupport::TestCase
  
  should have_many :classifications
  should have_many :items
  
end
