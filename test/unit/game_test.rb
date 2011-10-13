require 'test_helper'

class GameTest < ActiveSupport::TestCase
  
  should belong_to :challenger
  should belong_to :challengee
  should belong_to :winner
  should belong_to :loser

  should have_many :tiles
  should have_many :actions

  context "A game" do
    
    setup do
      bootstrap_ores
      @game = Fabricate(:game)
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

    should "generate a tile" do
      assert_difference("Tile.count", +1) do
        @game.generate_tile(1, 2)
      end
      tile = @game.tiles.last
      assert_equal [1, 2], [tile.x, tile.y]
    end

    should "init its tiles when reset" do
      assert_difference("Tile.count", Game::DEFAULT_ROWS*Game::DEFAULT_COLS) do
        @game.reset!
      end
    end

    should "spend action" do
      assert_difference("@game.challenger_turns_remaining", -1) do
        @game.spend_action
      end
    end
    
  end

end
