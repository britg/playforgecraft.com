require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  
  should belong_to :user
  should have_many :games

  should validate_presence_of :name
  should validate_uniqueness_of :name

  setup do
    @player = Fabricate(:player)
  end

  should "set initial level to 1" do
    player = Player.create(:name => "Cheese")
    assert_equal 1, player.level
  end

  should "return name for to_s" do
    assert_equal "#{@player.name} (#{@player.level})", @player.to_s
  end

  should "return name for to_param" do
    assert_equal "#{@player.name}", @player.to_param
  end

  context "With rarities" do
    
    setup do
      bootstrap_rarities
      @rare = Fabricate(:item, :rarity => Rarity.of(:rare))
      @epic = Fabricate(:item, :rarity => Rarity.of(:epic))
      @set = Fabricate(:item, :rarity => Rarity.of(:set))
    end

    context "With any loot" do

      setup do
        @player.loot.create(:item => @epic)  
      end

      should "return item_count" do
        assert_equal 1, @player.item_count
      end

      should "return item_percent" do
        assert_equal 33, @player.item_percent
      end
      
    end

    context "Without any loot" do

      should "return item_count" do
        assert_equal 0, @player.item_count
      end

      should "return item_percent" do
        assert_equal 0, @player.item_percent
      end

    end

    context "With rare loot" do

      setup do
        @player.loot.create(:item => @rare)  
      end

      should "return rare_count" do
        assert_equal 1, @player.rare_count
      end

      should "return rare_percent" do
        assert_equal 100, @player.rare_percent
      end
      
    end

    context "Without rare loot" do

      should "return rare_count" do
        assert_equal 0, @player.rare_count
      end

      should "return rare_percent" do
        assert_equal 0, @player.rare_percent
      end

    end

    context "With epic loot" do

      setup do
        @player.loot.create(:item => @epic)  
      end

      should "return epic_count" do
        assert_equal 1, @player.epic_count
      end

      should "return epic_percent" do
        assert_equal 100, @player.epic_percent
      end
      
    end

    context "Without epic loot" do

      should "return epic_count" do
        assert_equal 0, @player.epic_count
      end

      should "return epic_percent" do
        assert_equal 0, @player.epic_percent
      end

    end

  end

  context "With a game in progress" do
    
    setup do
      @game = Fabricate(:game, :challenger_id => @player.id, :challenger_turns_remaining => 1)
    end

    should "return the last active game" do
      assert_equal @game, @player.active_game
    end
    
  end


  context "With no game in progress" do
    
    setup do
      @game = Fabricate(:game, :challenger_id => @player.id, :challenger_turns_remaining => 0)
    end

    should "return no game" do
      assert_no_difference("@player.games.count") do
        assert_equal nil, @player.active_game
      end
    end
    
  end

  should "start a game" do
    assert_difference("@player.games.count", +1) do
      @player.start_game
    end
  end

  should "start a game as a singleplayer game" do
    new_game = @player.start_game
    assert_equal true, new_game.is_singleplayer?
  end

end
