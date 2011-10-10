require 'test_helper'

class LootTest < ActiveSupport::TestCase
  
  should belong_to :player
  should belong_to :game
  should belong_to :action
  should belong_to :item

  setup do
    @class = Fabricate(:classification)
    @ore = Fabricate(:ore)
    @item = Fabricate(:item, :classification => @class, :ore => @ore, :level => 10)
    @player = Fabricate(:player, :level => 10)
    @accuracy = 100
  end

  context "The Loot class" do

    should "generate loot in the given item class/ore" do
      loot = Loot.generate(@class, @ore, @accuracy, @player.level)
      assert_equal loot.item, @item
    end

  end

end
