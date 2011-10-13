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

  context "The Item class" do
    
    should "Have scopes for each rarity" do
      Rarity::DEFAULTS.each do |r|
        assert_not_nil Item.send(r.downcase.to_sym)
      end
    end

    should "Have scopes for each classification" do
      Classification::DEFAULTS.each do |type, classes|
        classes.each do |c|
          assert_not_nil Item.send(c.downcase.to_sym)
        end
      end
    end

    should "have a helper method for item counts under a class and ore" do
      @class = Fabricate(:classification)
      @ore = Fabricate(:ore)
      @item = Fabricate(:item, :ore => @ore, :classification => @class)
      assert_equal 1, Item.item_count(@class, @ore)
    end

    should "respond to armory_dump" do
      assert_not_nil Item.armory_dump
    end

  end

  context "An item" do
    
    setup do
      @class = Fabricate(:classification)
      @item = Fabricate(:item, :classification => @class)
    end

    should "respond to to_s with its name" do
      assert_equal @item.name, @item.to_s
    end

    should "respond to to_css_classes with its type downcased" do
      assert_equal @item.type.downcase, @item.to_css_classes
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

    should "have an accessor method for its icon url" do
      assert_equal @item.icon.url(:thumb), @item.icon_url
    end

    should "include its icon url in serialization" do
      assert_match "icon_url", @item.to_json
      assert_match @item.icon.url(:thumb), @item.to_json
    end

    should "have an accessor method for its art url" do
      assert_equal @item.art.url(:full), @item.art_url
    end

    should "include its art url in serialization" do
      assert_match "art_url", @item.to_json
      assert_match @item.art.url(:full), @item.to_json
    end
    
  end
  
end
