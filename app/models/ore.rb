class Ore < ActiveRecord::Base

  DEFAULTS = ["Stone", "Bronze", "Iron", "Dark Iron", "Gold", "Mithril"]

  has_many :items

  validates_presence_of :name, :rank
  
end
