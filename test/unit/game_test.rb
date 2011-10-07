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

    should "init its tiles when reset" do
      assert_difference("Tile.count", Game::DEFAULT_ROWS*Game::DEFAULT_COLS) do
        @game.reset!
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

    
  end

end
