require 'test_helper'

class ClassificationTest < ActiveSupport::TestCase
  
  should belong_to :genre
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :genre

  context "The Classification class" do
    
    setup do
      @name = "Swords"
      @class = Fabricate(:classification, :name => @name.singularize)
    end

    should "abstract find to take an id or class name" do
      assert_equal @class, Classification.find(@name)
      assert_equal @class, Classification.find(@class.id)
    end

    should "output for select options" do
      assert_not_nil Classification.to_select_options
    end

    context "with items" do
      
      setup do
        Fabricate(:item, :classification => @class)  
      end
      
      should "have a convenience method for item counts" do
        assert_equal 1, Classification.item_count(:swords)
        assert_equal 0, Classification.item_count(:cheeses)
      end

    end
    

  end
  
  context "A classification" do

    setup do
      @class = Fabricate(:classification)
      assert_not_nil @class.genre
    end

    should "respond to to_s with its name pluralized" do
      assert_equal @class.name.pluralize, @class.to_s
    end

    should "have a convenience method for its genre" do
      @class.genre.stubs(:name).returns("Weapon")
      assert_equal true, @class.weapon?
      assert_equal false, @class.armor?

      @class.genre.stubs(:name).returns("Armor")
      assert_equal true, @class.armor?
      assert_equal false, @class.weapon?
    end

    should "have an accessor method for its default_icon url" do
      assert_equal @class.default_icon.url(:thumb), @class.default_icon_url
    end

    should "include its default_icon url in serialization" do
      assert_match "default_icon_url", @class.to_json
      assert_match @class.default_icon.url(:thumb), @class.to_json
    end

    should "have an accessor method for its default_art url" do
      assert_equal @class.default_art.url(:full), @class.default_art_url
    end

    should "include its default_art url in serialization" do
      assert_match "default_art_url", @class.to_json
      assert_match @class.default_art.url(:full), @class.to_json
    end
    
  end


end
