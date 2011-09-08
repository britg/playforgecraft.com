require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  
  should belong_to :user

  should validate_presence_of :name
  should validate_uniqueness_of :name

  setup do
    @player = Fabricate(:player)
  end

end
