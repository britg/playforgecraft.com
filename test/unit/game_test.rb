require 'test_helper'

class GameTest < ActiveSupport::TestCase
  
  should belong_to :challenger
  should belong_to :challengee
  should belong_to :winner
  should belong_to :loser

  should have_many :tiles
  should have_many :actions

  should_allow_values_for :game_type, :singleplayer, :multiplayer, :workorder

  context "A game" do
    
    setup do
      bootstrap_ores
      @game = Fabricate(:game)
    end

    should "scope to in_progress" do
      assert_not_nil Game.in_progress
    end

    should "scope to singleplayer" do
      assert_not_nil Game.singleplayer
    end

    should "scope to multiplayer" do
      assert_not_nil Game.multiplayer
    end

    should "scope to workorder" do
      assert_not_nil Game.workorder
    end

    context "With challenger turns remaining" do
      
      setup do
        @game.stubs(:challenger_turns_remaining).returns(1)  
      end
      
      should "not be finished?" do
        assert_equal false, @game.finished?
      end

    end

    context "With no challenger turns remaining" do
      
      setup do
        @game.stubs(:challenger_turns_remaining).returns(0)
      end

      should "be finished?" do
        assert_equal true, @game.finished?
      end

    end

    context "without a player" do
      should "return false to has_player?" do
        assert_equal false, @game.has_player?(Fabricate(:player, :name => "joe"))
      end
    end

    context "With a player" do
      
      setup do
        @player = Fabricate(:player)
        @game.challenger = @player
        @game.save
      end

      should "return true to has_player?" do
        assert_equal true, @game.has_player?(@player)
      end

      should "return false to has_player? if not recognized" do
        assert_equal false, @game.has_player?(Fabricate(:player, :name => "frank"))
      end
      
    end

    should "spend action" do
      assert_difference("@game.challenger_turns_remaining", -1) do
        @game.spend_action
      end
    end
    
  end

  context "A singleplayer game" do
    
    setup do
      @singleplayer = Fabricate(:game, :game_type => :singleplayer)
    end

    should "respond true to is_singleplayer?" do
      assert_equal true, @singleplayer.is_singleplayer?
    end

    should "respond false to is_multiplayer?" do
      assert_equal false, @singleplayer.is_multiplayer?
    end

    should "respond false to is_workorder?" do
      assert_equal false, @singleplayer.is_workorder?
    end

  end

  context "A multiplayer game" do
    
    setup do
      @multiplayer = Fabricate(:game, :game_type => :multiplayer)
    end

    should "respond false to is_singleplayer?" do
      assert_equal false, @multiplayer.is_singleplayer?
    end

    should "respond true to is_multiplayer?" do
      assert_equal true, @multiplayer.is_multiplayer?
    end

    should "respond false to is_workorder?" do
      assert_equal false, @multiplayer.is_workorder?
    end

  end

  context "A workorder game" do
    
    setup do
      @workorder = Fabricate(:game, :game_type => :workorder)
    end

    should "respond false to is_singleplayer?" do
      assert_equal false, @workorder.is_singleplayer?
    end

    should "respond fasle to is_multiplayer?" do
      assert_equal false, @workorder.is_multiplayer?
    end

    should "respond true to is_workorder?" do
      assert_equal true, @workorder.is_workorder?
    end

  end

end
