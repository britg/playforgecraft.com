require 'test_helper'

class GameTest < ActiveSupport::TestCase
  
  should belong_to :challenger
  should belong_to :challengee
  should belong_to :winner
  should belong_to :loser

  should have_many :tiles
  should have_many :turns

end
