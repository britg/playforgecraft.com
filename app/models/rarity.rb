class Rarity < ActiveRecord::Base

  DEFAULTS = ["Common", "Advanced", "Rare", "Set", "Epic"]

  has_many :items

  validates_presence_of :name, :rank

  default_scope order("rank asc")

  def to_s
    name.downcase
  end
  
  # Class Methods
  class << self
    
    def to_select_options
      order("rank").map{ |o| [o.name, o.id] }
    end

  end

end
