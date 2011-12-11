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

    def of sym
      Rarity.find_by_name(sym.to_s.capitalize)
    end

    def common
      @common ||= find_by_name("Common")
    end

    def advanced
      @advanced ||= find_by_name("Advanced")
    end

    def rare
      @rare ||= find_by_name("Rare")
    end

    def set
      @set ||= find_by_name("Set")
    end

    def epic
      @epic ||= find_by_name("Epic")
    end

  end

  def to_css_class
    if name == "Set"
      return "itemset"
    end
    to_s
  end

  def common?
    name == "Common"
  end

  def advanced?
    name == "Advanced"
  end

  def rare?
    name == "Rare"
  end

  def set?
    name == "Set"
  end

  def epic?
    name == "Epic"
  end

end
