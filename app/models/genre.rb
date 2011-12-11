class Genre < ActiveRecord::Base

  DEFAULTS = ["Armor", "Weapon"]

  has_many :classifications
  has_many :items

  validates_presence_of :name

  def to_s
    name.pluralize
  end
  
end
