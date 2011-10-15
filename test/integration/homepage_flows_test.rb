require 'test_helper'

class HomepageFlowsTest < ActionDispatch::IntegrationTest
  
  context "Without a user" do

    setup do
      get root_path
    end
    
    should "route to splash page" do
      assert_equal root_path, '/'
    end

    should "respond successfully" do
      assert_response :success
    end

    should "show splace content" do
      assert_select '#splash-page'
    end

  end
end
