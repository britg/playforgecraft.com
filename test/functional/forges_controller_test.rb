require 'test_helper'

class ForgesControllerTest < ActionController::TestCase

  context "Without a player" do
    
    should "redirect and message when trying to forge" do
      get :show
      assert_redirected_to root_path
    end

  end

  context "With a player" do
    
    setup do
      @user = Fabricate(:user)
      @player = @user.player
      sign_in @user
    end

    should "show the forge gameplay page" do
      get :show
      assert_response :success
    end

  end

end