require 'test_helper'

class GamesControllerTest < ActionController::TestCase

  context "Without a player" do
    
    should "redirect and message when trying to play" do
      get :new
      assert_redirected_to root_path
    end

  end

  context "With a player" do
    
    setup do
      @user = Fabricate(:user)
      @player = @user.player
      sign_in @user
    end

    should "start a new game" do
      assert_difference("Game.count", +1) do
        get :new
      end
      
      assert_redirected_to game_path(Game.last)
    end

    context "With an existing game belonging to player" do
      
      setup do
        @game = Fabricate(:game, :challenger_id => @player.id)
      end

      should "GET show" do
        get :show, :id => @game.id
        assert_response :success
      end

      should "Set the game id for backbone" do
        get :show, :id => @game.id
        assert_match "game.set({id: \"#{@game.id}\"});", response.body
      end

    end

    context "With an existing game not belonging to player" do
      
      setup do
        @game = Fabricate(:game)
      end

      should "not allow access to the game" do
        get :show, :id => @game
        assert_redirected_to root_path
      end

    end

  end

end