class Loot < ActiveRecord::Base

  default_scope where(:available => true)

  ADVANCED_THRESHOLD = 90.0
  RARE_THRESHOLD = 94.9
  EPIC_THRESHOLD = 99.0

  belongs_to :player
  belongs_to :game
  belongs_to :action
  belongs_to :item

  before_create :purchase
  after_save :update_progress
  after_create :create_event

  validates_presence_of :item

  class << self

    def generate classification, ore, accuracy, player, forge
      item = roll classification, ore, accuracy, player, forge
      return nil unless item

      loot = Loot.new( :item => item,
                       :rating => item.rating,
                       :player => player, 
                       :forge_id => forge.to_param,
                       :mine_id => player.mine_id )
      loot.set_stats accuracy
      loot
    end

    def roll classification, ore, accuracy, player, forge
      rarity = roll_rarity(accuracy, forge)
      item = Item.where(:classification_id => classification, 
                        :ore_id => ore, 
                        :zone_id => forge.zone_id,
                        :rarity_id => rarity.try(:id)).random
    end

    def roll_rarity accuracy=0, forge
      rand        = Random.new
      chance      = rand.rand(1000).to_f/10.0

      rarity = (accuracy.present? and accuracy > Forge::PERFECT_ACCURACY) ? Rarity.advanced : Rarity.common

      if forge.has_rarity?(Rarity.epic) and chance >= EPIC_THRESHOLD
        return Rarity.epic
      elsif forge.has_rarity?(Rarity.rare) and chance > RARE_THRESHOLD
        return Rarity.rare
      elsif forge.has_rarity?(Rarity.advanced) and chance > ADVANCED_THRESHOLD
        return Rarity.advanced
      end

      return rarity
    end

    def of_item item
      where(:item_id => item)
    end

    def best item
      of_item(item).order("rating desc").first
    end

  end

  def serializable_hash(opts = {})
    super((opts||{}).merge( :only => [:id, :attack, :defense, :battle_id],
                            :methods => [:item_attributes, :level, :equipped?]))
  end

  def to_s
    item.to_s
  end

  def item_attributes
    return {} unless item
    {
      :name => item.name,
      :icon_url => item.icon_url,
      :type => to_css_classes,
      :param => item.to_param, 
      :cost => item.cost!
    }
  end

  def to_css_classes
    item.try(:to_css_classes)
  end

  def forge
    Forge.find(forge_id)
  end

  def icon
    item.icon.url(:tiny) rescue Classification.new.default_icon.url(:tiny)
  end

  def rarity
    item.rarity rescue ""
  end

  def name
    item.name rescue ""
  end

  def classification
    item.classification.to_s rescue ""    
  end

  def level
    item.level rescue 0
  end

  def set_stats accuracy
    self.attack = stat_by_accuracy(item.attack_min, item.attack_max, accuracy)
    self.defense = stat_by_accuracy(item.defense_min, item.defense_max, accuracy)
  end

  def stat_by_accuracy(min, max, accuracy)
    return nil unless min.present? and max.present?
    diff = max - min
    pc = (accuracy.to_f/100.0) * diff
    return (min + pc).round
  end

  def purchase
    return unless player
    return unless item
    return true unless forge.requires_funding?
    player.purchase!(buy_price)
  end

  def sell
    return unless player
    return unless item
    player.sell!(sell_price)
    destroy
  end

  def buy_price
    # item.cost!
    0
  end

  def sell_price
    item.cost!
  end

  def destroy
    update_attributes(:available => false)
  end

  # Equipping

  def equipped?
    HeroSlot.where(:loot_id => id).any?
  end

  def equippable? hero, slot
    return false if level > player.level
    return false if hero.player != player
    return false unless available?
    return false if equipped?
    return false unless slot.accepts?(self)
    true
  end

  def diff other_loot
    if item.weapon?
      (self.attack||0) - (other_loot.attack||0)
    else
      (self.defense||0) - (other_loot.defense||0)
    end
  end

  def update_progress
    forge.update_progress(self)
  end

  def create_event
    forge.generate_loot_event(self)
    true
  end

end
