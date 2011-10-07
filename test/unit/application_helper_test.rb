require 'test_helper'

class ApplicationHelperTest < ActionView::TestCase

  context "With an item" do
    
    setup do
      @item = Fabricate(:item)
    end
    
    should "have a loot convenience method" do
      assert_equal link_to(@item, item_path(@item), :class => @item.rarity), loot(@item)
    end

  end

  context "With an ore and a tile" do

    setup do
      @ore = Fabricate(:ore)
      @tile = Fabricate(:tile, :ore_id => @ore.id)
    end
      
    should "return a tile image" do
      assert tag = tile_image(@tile)
    end

    context "a rendered tile image" do

      setup do
        @tag = tile_image(@tile)
        render :text => @tag
      end

      should "have a class equal to the ore type" do
        assert_select "img.#{@tile.to_ore}"
      end

      should "have a data-x property" do
        assert_select "img[data-x=#{@tile.x}]"
      end

      should "have a data-y property" do
        assert_select "img[data-y=#{@tile.y}]"
      end

      should "have a data-ore property" do
        assert_select "img[data-ore=#{@tile.to_ore}]"
      end
      
    end
      
  end

end