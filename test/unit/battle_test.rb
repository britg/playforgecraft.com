require 'test_helper'

class BattleTest < ActiveSupport::TestCase

  context "The Battle class" do
    
    should "have a singleplayer scope" do
      assert_not_nil Battle.singleplayer
    end

    should "have a multiplayer scope" do
      assert_not_nil Battle.multiplayer
    end

    should "have an active scope" do
      assert_not_nil Battle.active
    end

  end

  context "A Battle" do
    
    setup do
      @player1 = Fabricate(:player, :name => "1")
      @player2 = Fabricate(:player, :name => "2")
      @battle = Battle.create :player_ids => [@player1.id, @player2.id], :mode => :singleplayer
    end

    should "default to unfinished" do
      assert_equal false, @battle.finished?
    end

    should "default to no winner" do
      assert_equal nil, @battle.winner
    end
    
  end

end
