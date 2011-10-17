require 'test_helper'

class UsersControllerTest < ActionController::TestCase

  context "While logged out" do
    
    setup do
      
    end

    context "GET index" do
      
      setup do
        get :index
      end

      should "respond successfully" do
        assert_response :success
      end

      should "have a Log in link" do
        assert_select 'a', 'Log in'
      end

      should "not have a My Profile link" do
        assert_select '.my-profile', 0
      end

    end

  end

  context "While logged in" do
    
    setup do
      @user = Fabricate(:user)
      sign_in @user
    end

    context "GET index" do
      
      setup do
        get :index
      end

      should "redirect to player page" do
        assert_redirected_to player_path(@user.player.name)
      end

    end

    

  end

end