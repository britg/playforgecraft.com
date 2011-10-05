require 'test_helper'

class ActionTest < ActiveSupport::TestCase
  
  should belong_to :game
  should belong_to :player
  should belong_to :loot

  should have_and_belong_to_many :tiles

  
end
