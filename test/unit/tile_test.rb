require 'test_helper'

class TileTest < ActiveSupport::TestCase
  
  should belong_to :game
  should belong_to :ore

  should validate_presence_of :game
  should validate_presence_of :ore

  setup do
    @tile = Fabricate(:tile)
  end

  context "A tile" do

    should "start unconsumed" do
      assert_equal false, @tile.consumed?  
    end

    should "return its ore name from to_ore" do
      assert_equal @tile.ore.to_s.parameterize, @tile.to_ore
    end
    
  end
  
end
