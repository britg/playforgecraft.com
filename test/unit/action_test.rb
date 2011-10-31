require 'test_helper'

class ActionTest < ActiveSupport::TestCase
  
  should belong_to :game
  should belong_to :player
  should belong_to :loot

  should have_and_belong_to_many :tiles

  context "With a swap_tile action" do
    
    setup do
      @tileOne = Fabricate(:tile, :x => 1, :y => 1)
      @tileTwo = Fabricate(:tile, :x => 2, :y => 2)
    end

    should "swap tiles on create" do
      @action = Fabricate(:action, :action => Action::SWAP_TILES_ACTION, :tiles => [@tileOne, @tileTwo])
      @tileOne.reload
      @tileTwo.reload
      assert_equal 2, @tileOne.x
      assert_equal 2, @tileOne.y
      assert_equal 1, @tileTwo.x
      assert_equal 1, @tileTwo.y
    end

  end
  
end
