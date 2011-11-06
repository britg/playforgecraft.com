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

  end

end