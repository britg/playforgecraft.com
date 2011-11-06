class Hero < ActiveRecord::Base

  belongs_to :player
  belongs_to :job, :class_name => "HeroClass", :foreign_key => "hero_class_id"
  has_many :slots, :class_name => "HeroSlot"

  validates_presence_of :name
  validates_presence_of :job
  validates_presence_of :player

  after_create :create_slots

  class << self

    def create_heroes_for player
      HeroClass.all.each do |hero_class|
        player.heroes.build(:name => hero_class.name, :job => hero_class) \
          unless player.hero_for_class(hero_class).present?
      end
      player.save
    end

  end

  def slot type
    send(:"#{type.to_s}_slot")
  end

  def weapon1_slot
    slots.weapon1.first
  end

  def weapon1
    weapon1_slot.try(:loot)
  end

  def weapon2_slot
    slots.weapon2.first
  end

  def weapon2
    weapon2_slot.try(:loot)
  end

  def armor_slot
    slots.armor.first
  end

  def armor
    armor_slot.try(:loot)
  end

  def leggings_slot
    slots.leggings.first
  end

  def leggings
    leggings_slot.try(:loot)
  end

  def create_slots
    HeroSlot::SLOTS.each do |slot_type|
      self.slots.create(:slot => slot_type) unless slot(slot_type).present?
    end
  end

end
