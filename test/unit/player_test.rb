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

  context "With a game in progress" do
    
    setup do
      @game = Fabricate(:game, :challenger_id => @player.id)
    end

    should "return the last active game" do
      assert_equal @game, @player.active_game
    end
    
  end

end
