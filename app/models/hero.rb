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

  def warrior?
    @is_warrior ||= (job == HeroClass.warrior)
  end

  def thief?
    @is_thief ||= (job == HeroClass.thief)
  end

  def ranger?
    @is_ranger ||= (job == HeroClass.ranger)
  end

  def equip slot_type, loot
    return false unless slot(slot_type).accepts?(loot)
    equip! slot_type, loot
  end

  def equip! slot_type, loot
    slot(slot_type).update_attributes(:loot => loot)
    update_stats
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

  def update_stats
    update_attributes :attack => calculate_attack,
                      :defense => calculate_defense
  end

  def calculate_attack
    if warrior?
      weapon1.try(:attack)||0
    else
      (weapon1.try(:attack)||0) + (weapon2.try(:attack)||0)
    end
  end

  def calculate_defense
    if warrior?
      (weapon2.try(:defense)||0) + (armor.try(:defense)||0) + (leggings.try(:defense)||0)
    else
      (armor.try(:defense)||0) + (leggings.try(:defense)||0)
    end
  end

  def create_slots
    HeroSlot::SLOTS.each do |slot_type|
      self.slots.create(:slot => slot_type) unless slot(slot_type).present?
    end
  end

end
