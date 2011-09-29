require 'test_helper'

class OreTest < ActiveSupport::TestCase
  
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :rank
  
  setup do
    @ore = Fabricate(:ore)
  end

  context "The Ore class" do
    
    should "output for select options" do
      assert_not_nil Ore.to_select_options
    end

    should "list browsable ores" do
      assert_not_nil Ore.browsable
    end

  end

  context "An ore" do

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
