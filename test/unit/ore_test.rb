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

    should "return a random ore" do
      bootstrap_ores
      assert Ore.all.include? Ore.random
    end

    should "cache rank requests" do
      2.times do
        assert_equal Ore.where(:rank => @ore.rank).first, Ore.rank_cache(@ore.rank)
      end
    end

    should "cache tile requests" do
      2.times do
        assert_equal @ore.tile.url, Ore.tile_cache(@ore.id).url
      end
    end

    should "cache name requests" do
      2.times do
        assert_equal @ore.to_s.parameterize, Ore.name_cache(@ore.id)  
      end
    end

    should "gracefully handle bad tile requests" do
      assert_equal Ore.new.tile.url, Ore.tile_cache(nil).url
    end

    should "gracefully handle bad name requests" do
      assert_equal "", Ore.name_cache(nil)
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
