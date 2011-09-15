require 'test_helper'

class ClassificationsControllerTest < ActionController::TestCase

  setup do
    @class = Fabricate(:classification)
  end
  
  should "GET index" do
    get :index
    assert_response :success
    assert_select '#class-nav'
  end

  should "GET show" do
    get :show, :id => @class.to_param
    assert_response :success
    assert_select 'ul.ore-nav'
  end

end