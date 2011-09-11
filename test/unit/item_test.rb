require 'test_helper'

class ItemTest < ActiveSupport::TestCase
  
  should belong_to :genre
  should belong_to :classification
  should belong_to :ore
  should belong_to :rarity
  should belong_to :item_set

  context "An item" do
    
    setup do
      @item = Fabricate(:item)
    end

    should "respond to to_s with its name" do
      assert_equal @item.name, @item.to_s
    end
    
  end
  
end
