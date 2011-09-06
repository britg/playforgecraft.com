class Classification < ActiveRecord::Base

  DEFAULTS = { :weapon => ["Sword", "Axe", "Long Sword"],
               :armor => ["Shield", "Leggings", "Tunic"] }

  belongs_to :genre
  has_many :items

  validates_presence_of :name, :genre

end
