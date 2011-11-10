class Loot < ActiveRecord::Base

  default_scope order("id desc").where(:available => true)

  belongs_to :player
  belongs_to :game
  belongs_to :action
  belongs_to :item

  before_create :purchase

  validates_presence_of :item

  class << self

    def generate classification, ore, accuracy, player
      item = roll classification, ore, accuracy, player.level
      return nil unless item

      loot = Loot.new( :item => item, :player => player )
      loot.set_stats accuracy
      loot
    end

    def roll classification, ore, accuracy, level
      item = Item.where(:classification_id => classification, :ore_id => ore).random
    end

  end

  def serializable_hash(opts = {})
    super((opts||{}).merge( :only => [:id, :attack, :defense],
                            :methods => [:item_attributes]))
  end

  def item_attributes
    return {} unless item
    {
      :name => item.name,
      :description => item.description,
      :icon_url => item.icon_url,
      :type => to_css_classes,
      :param => item.to_param,
      :cost => item.cost!
    }
  end

  def to_css_classes
    item.try(:to_css_classes)
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
    # STUB
    self.attack = self.item.attack_max
    self.defense = self.item.defense_max
  end

  def purchase
    return unless player
    return unless item
    player.purchase!(buy_price)
  end

  def sell
    return unless player
    return unless item
    player.sell!(sell_price)
    destroy
  end

  def buy_price
    item.cost!
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
    return false unless slot.accepts?(loot)
    true
  end

end
