require 'test_helper'

class ItemSetTest < ActiveSupport::TestCase
  
  should have_many :items

  setup do
    @itemset = Fabricate(:item_set)
  end

  should "have an accessor method for its icon url" do
    assert_equal @itemset.icon.url, @itemset.icon_url
  end

  should "include its icon url in serialization" do
    assert_match "icon_url", @itemset.to_json
    assert_match @itemset.icon.url, @itemset.to_json
  end

  should "have an accessor method for its art url" do
    assert_equal @itemset.art.url, @itemset.art_url
  end

  should "include its art url in serialization" do
    assert_match "art_url", @itemset.to_json
    assert_match @itemset.art.url, @itemset.to_json
  end
  
end
