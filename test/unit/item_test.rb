require 'test_helper'

class ItemTest < ActiveSupport::TestCase
  
  should belong_to :genre
  should belong_to :classification
  should belong_to :ore
  should belong_to :rarity
  should belong_to :item_set
  
end
