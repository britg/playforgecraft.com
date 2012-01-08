class HeroSlot < ActiveRecord::Base

  SLOTS = [:weapon1, :weapon2, :armor, :leggings]

  belongs_to :hero
  belongs_to :player
  belongs_to :loot

  validates_inclusion_of :slot, :in => SLOTS

  class << self

    def weapon1
      where(:slot => :weapon1)
    end

    def weapon2
      where(:slot => :weapon2)
    end

    def armor
      where(:slot => :armor)
    end

    def leggings
      where(:slot => :leggings)
    end

    def weapon1_classes
      ["Sword"]
    end

  end

  def slot
    attributes["slot"].to_sym
  end

  def to_s
    slot.to_s
  end

  def empty?
    !loot.present?
  end

  def accepts? loot
    return false unless loot.present?
    acceptable_classifications.include? loot.classification
  end

  def acceptable_classifications
    case slot
    when :weapon1
      case hero.job.name
      when :warrior
        ["Swords", "Axes"]
      when :thief
        ["Swords", "Axes"]
      when :ranger
        ["Crossbows"]
      end
    when :weapon2
      case hero.job.name
      when :warrior
        ["Shields"]
      when :thief
        ["Swords", "Axes"]
      when :ranger
        ["Crossbows"]
      end
    when :armor
      ["Tunics"]
    when :leggings
      ["Leggings"]
    end
  end

end