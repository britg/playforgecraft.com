class Item < ActiveRecord::Base
  
  belongs_to :genre
  belongs_to :classification
  belongs_to :ore
  belongs_to :rarity
  belongs_to :item_set

end
