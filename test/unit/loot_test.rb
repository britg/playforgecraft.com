require 'test_helper'

class LootTest < ActiveSupport::TestCase
  
  should belong_to :player
  should belong_to :game
  should belong_to :action
  should belong_to :item

  should validate_presence_of :item

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

  context "A Loot with an item" do
    
    setup do
      @loot = Fabricate(:loot, :item_id => @item.id, :player_id => @player.id)
    end

    should "return its item attributes" do
      assert_equal @item.name, @loot.item_attributes[:name]
      assert_equal @item.description, @loot.item_attributes[:description]
      assert_equal @item.icon_url, @loot.item_attributes[:icon_url]
      assert_equal @item.type.downcase, @loot.item_attributes[:type]
      assert_equal @item.to_param, @loot.item_attributes[:param]
    end

    should "return its css class" do
      assert_equal @item.to_css_classes, @loot.to_css_classes
    end

    should "access icon" do
      assert_equal @item.icon.url(:tiny), @loot.icon
    end

    should "access rarity" do
      assert_equal @item.rarity, @loot.rarity
    end

    should "access name" do
      assert_equal @item.name, @loot.name
    end

    should "set stats" do
      # STUB
    end


    context "with a game" do
      
      setup do
        @game = Fabricate(:game, :challenger_id => @player.id)
        @loot.stubs(:game).returns(@game)
        @attack = @defense = 100
        @loot.stubs(:attack).returns(@attack)
        @loot.stubs(:defense).returns(@defense)
      end

      should "update attack score" do
        assert_difference("@game.challenger_attack_score", @attack) do
          @loot.update_score
        end
      end    

      should "update defense score" do
        assert_difference("@game.challenger_defense_score", @defense) do
          @loot.update_score
        end
      end

    end
  end

  context "A Loot without an item" do
    
    setup do
      @loot = Fabricate.build(:loot)
    end

    should "return an empty hash for item attributes" do
      assert_equal({}, @loot.item_attributes)

      assert_equal nil, @loot.item_attributes[:name]
      assert_equal nil, @loot.item_attributes[:description]
      assert_equal nil, @loot.item_attributes[:icon_url]
      assert_equal nil, @loot.item_attributes[:type]
      assert_equal nil, @loot.item_attributes[:param]
    end

    should "return its css class" do
      assert_equal nil, @loot.to_css_classes
    end

    should "access icon" do
      assert_equal Classification.new.default_icon.url(:tiny), @loot.icon
    end

    should "access rarity" do
      assert_equal "", @loot.rarity
    end

    should "access name" do
      assert_equal "", @loot.name
    end

  end

end
