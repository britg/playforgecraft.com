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

    should "have an accessor method for its tile url" do
      assert_equal @ore.tile.url(:large), @ore.tile_url
    end

    should "include its tile url in serialization" do
      assert_match "tile_url", @ore.to_json
      assert_match @ore.tile.url(:large), @ore.to_json
    end

  end

end
