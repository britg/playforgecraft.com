require 'test_helper'

class TurnTest < ActiveSupport::TestCase
  
  should belong_to :game
  should belong_to :player
  should belong_to :loot

  should have_and_belong_to_many :tiles

  should validate_presence_of :number
  should validate_presence_of :game
  should validate_presence_of :player
  should_validate_uniqueness_of :number, :scoped_to => :game_id

  setup do
    @turn = Fabricate(:turn)
  end

end
