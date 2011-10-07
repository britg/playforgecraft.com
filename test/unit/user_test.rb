require 'test_helper'

class UserTest < ActiveSupport::TestCase
  
  should have_one :player

  should validate_presence_of :player
  
end
