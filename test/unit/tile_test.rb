require 'test_helper'

class TileTest < ActiveSupport::TestCase
  
  should belong_to :game
  should belong_to :ore

  should validate_presence_of :game
  should validate_presence_of :ore

  setup do
    @tileX = 1
    @tileY = 1
    @tile = Fabricate(:tile, :x => @tileX, :y => @tileY)
  end

  context "A tile" do

    should "start unconsumed" do
      assert_equal false, @tile.consumed?  
    end

    should "return its ore name from to_ore" do
      assert_equal @tile.ore.to_s.parameterize, @tile.to_ore
    end

    context "swapped with another tile" do
      
      setup do
        @otherX = 2
        @otherY = 2
        @other = Fabricate(:tile, :x => 2, :y => 2)
        @tile.swap_with(@other)
      end

      should "have the other tile's x value" do
        assert_equal @otherX, @tile.x
      end

      should "have the other tile's y value" do
        assert_equal @otherY, @tile.y
      end

      should "give the other tile its x value" do
        assert_equal @tileX, @other.x
      end

      should "give the other tile its y value" do
        assert_equal @tileY, @other.y
      end
    end
    
  end
  
end
