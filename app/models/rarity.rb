class Rarity < ActiveRecord::Base

  DEFAULTS = ["Common", "Advanced", "Rare", "Epic"]

  has_many :items

  validates_presence_of :name, :rank
  
end
