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

end