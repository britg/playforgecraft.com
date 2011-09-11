require 'test_helper'

class ClassificationTest < ActiveSupport::TestCase
  
  should belong_to :genre
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :genre
  
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
    
  end


end
