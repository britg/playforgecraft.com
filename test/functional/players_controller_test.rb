require 'test_helper'

class PlayersControllerTest < ActionController::TestCase

  setup do
    @user = Fabricate(:user)
    @player = @user.player
  end

  context "GET :username" do
    
    setup do
      get :show, :playername => @player.name
    end

    should "respond successfully" do
      assert_response :success
    end

    should "have a player slug" do
      assert_select '.player-slug'
    end

    should "not show a quick play button" do
      #TODO
    end

    context "current player is the player viewed" do
      
      setup do
        sign_in @user
        get :show, :playername => @player.name
      end

      should "respond successfully" do
        assert_response :success
      end

      should "show a quick play button" do
        assert_select ".heading" do
          assert_select ".button"
        end
      end

    end

  end

  context "GET ladder" do
    
    setup do
      get :index
    end

    should "respond successfully" do
      assert_response :success
    end

    should "show the ladder" do
      assert_select "#ladder"
    end

  end


end