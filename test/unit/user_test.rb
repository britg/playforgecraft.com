require 'test_helper'

class UserTest < ActiveSupport::TestCase
  
  should have_one :player

  should accept_nested_attributes_for :player
  
end
