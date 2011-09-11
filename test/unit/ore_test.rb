require 'test_helper'

class OreTest < ActiveSupport::TestCase
  
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :rank

  context "An ore" do
    
    setup do
      @ore = Fabricate(:ore)
    end

    should "respond with its name to to_s" do
      assert_equal @ore.name, @ore.to_s
    end

  end

end
