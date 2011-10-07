require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  
  should belong_to :user
  should have_many :games

  should validate_presence_of :name
  should validate_uniqueness_of :name

  setup do
    @player = Fabricate(:player)
  end

  should "return name for to_s" do
    assert_equal @player.name, @player.to_s
  end

  context "With a game in progress" do
    
    setup do
      @game = Fabricate(:game, :challenger_id => @player.id)
    end

    should "return the last active game" do
      assert_equal @game, @player.active_game
    end
    
  end

end
