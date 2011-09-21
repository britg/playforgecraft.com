require 'test_helper'

class RarityTest < ActiveSupport::TestCase
  
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :rank

  setup do
    @common = Fabricate(:common_rarity)
    @advanced = Fabricate(:advanced_rarity)
    @rare = Fabricate(:rare_rarity)
    @set = Fabricate(:set_rarity)
    @epic = Fabricate(:epic_rarity)
  end

  context "Rarity class" do
    
    should "out for select options" do
      assert_not_nil opts = Rarity.to_select_options
      assert_equal opts.count, Rarity.count
    end

    should "shortcut find_by_name with of" do
      assert_not_nil Rarity.of(:common)
      assert_equal @common, Rarity.of(:common)
    end

  end

  context "A rarity" do

    should "respond to to_s with its name downcased" do
      assert_equal @common.name.downcase, @common.to_s
    end

    should "have helper methods for all rarity types" do
      prev = "Epic"
      Rarity::DEFAULTS.each do |type|
        rarity = Rarity.of(type.downcase.to_sym)
        assert_equal true, rarity.send("#{type.downcase}?".to_sym)
        assert_equal false, rarity.send("#{prev.downcase}?".to_sym)
        prev = type
      end
    end

  end
  
end