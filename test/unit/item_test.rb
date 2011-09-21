require 'test_helper'

class ItemTest < ActiveSupport::TestCase
  
  should belong_to :genre
  should belong_to :classification
  should belong_to :ore
  should belong_to :rarity
  should belong_to :item_set

  should validate_presence_of :name
  should validate_presence_of :genre
  should validate_presence_of :classification
  should validate_presence_of :ore
  should validate_presence_of :rarity

  context "An item" do
    
    setup do
      @class = Fabricate(:classification)
      @item = Fabricate(:item, :classification => @class)
    end

    should "respond to to_s with its name" do
      assert_equal @item.name, @item.to_s
    end

    should "set its genre before saving" do
      assert_not_nil @class.genre
      assert_equal @item.genre, @class.genre
    end

    should "have a convenience method for its genre" do
      @item.genre.stubs(:name).returns("Weapon")
      assert_equal true, @item.weapon?
      assert_equal false, @item.armor?

      @item.genre.stubs(:name).returns("Armor")
      assert_equal true, @item.armor?
      assert_equal false, @item.weapon?
    end

    should "set its rarity to 'set' if part of a set" do
      @item_set = Fabricate(:item_set)
      @set_rarity = Fabricate(:set_rarity)
      assert_not_equal @item.rarity, @set_rarity
      @item.update_attributes(:item_set => @item_set)
      assert_equal @item.rarity, @set_rarity
    end
    
  end
  
end
