require 'test_helper'

class ItemsControllerTest < ActionController::TestCase

  setup do
    @ore = Fabricate(:ore)
    @class = Fabricate(:classification)
  end

  should "GET index" do
    get :index, :armory_id => @class, :ore => @ore.to_param
    assert_response :success
    assert_select 'h3', "#{@ore} #{@class}"
  end

end