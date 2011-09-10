require 'test_helper'

class EmailTest < ActiveSupport::TestCase

  should validate_presence_of :address  
  should validate_uniqueness_of :address

  setup do
    @email = Fabricate(:email)
  end
  
end
