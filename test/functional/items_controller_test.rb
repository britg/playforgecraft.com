require 'test_helper'

class ItemsControllerTest < ActionController::TestCase

  setup do
    @ore = Fabricate(:ore)
    @class = Fabricate(:classification)
    @item = Fabricate(:item)
  end

  should "GET index" do
    get :index, :armory_id => @class, :ore => @ore.to_param
    assert_response :success
    assert_select 'h2', "#{@ore} #{@class}"
  end

  should "GET show" do
    get :show, :id => @item.to_param
    assert_response :success
    assert_select ".#{@item.rarity}"
  end

end