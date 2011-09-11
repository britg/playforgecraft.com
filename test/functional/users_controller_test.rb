require 'test_helper'

class UsersControllerTest < ActionController::TestCase

  context "While logged out" do
    
    setup do
      
    end

    should "GET index" do
      get :index
      assert_response :success
      assert_select 'a', 'Log in'
    end

  end

  context "While logged in" do
    
    setup do
      @user = Fabricate(:user)
      sign_in @user
    end

    should "GET index" do
      get :index
      assert_response :success
      assert_select 'a', 'Log out'
    end

  end

end