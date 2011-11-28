class Loot < ActiveRecord::Base

  default_scope order("id desc").where(:available => true)

  COMMON_THRESHOLD = 90.0
  ADVANCED_THRESHOLD = 99.0
  RARE_THRESHOLD = 99.9
  EPIC_THRESHOLD = 100.0

  belongs_to :player
  belongs_to :game
  belongs_to :action
  belongs_to :item

  before_create :purchase

  validates_presence_of :item

  class << self

    def generate classification, ore, accuracy, player
      item = roll classification, ore, accuracy, player.zone
      return nil unless item

      loot = Loot.new( :item => item, :player => player, :forge_id => player.forge.to_param, :mine_id => player.mine_id )
      loot.set_stats accuracy
      loot
    end

    def roll classification, ore, accuracy, zone
      rarity = roll_rarity(accuracy)
      item = Item.where(:classification_id => classification, :ore_id => ore, :zone_id => zone, :rarity_id => rarity.try(:id)).random
    end

    def roll_rarity accuracy=0
      rand = Random.new
      chance = rand.rand(1000).to_f/10.0

      if chance < COMMON_THRESHOLD
        return Rarity.common
      elsif chance < ADVANCED_THRESHOLD
        return Rarity.advanced
      elsif chance < RARE_THRESHOLD
        return Rarity.rare
      elsif chance <= EPIC_THRESHOLD
        return Rarity.epic
      end

      return Rarity.common
    end

    def of_item item
      where(:item_id => item)
    end

    def best item
      scope = Loot.scoped
      scope = scope.of_item item

      if item.weapon?
        scope = scope.order("attack desc")
      else
        scope = scope.order("defense desc")
      end

      scope.each do |loot|
        return loot unless loot.equipped?
      end
      scope.first
    end

    def random_battle?
      rand = Random.new
      rand.rand(10) == 1
    end

  end

  def serializable_hash(opts = {})
    super((opts||{}).merge( :only => [:id, :attack, :defense, :battle_id],
                            :methods => [:item_attributes, :level, :equipped?, :battle_required?, :battle_won?]))
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

  # Battle

  def battle
    return nil unless battle_id.present?
    Battle.find(battle_id)
  end

  def generate_battle
    random_battle = Battle.create :mode => "singleplayer",
                                  :first_player_id => player_id,
                                  :forge_id => self.forge_id,
                                  :loot_id => self.id
    self.battle_id = random_battle.id.to_s
    self.save
  end

  def battle_required?
    battle.present? and !battle.finished?
  end

  def battle_won?
    battle_required? and battle.finished? and battle.winner_id == player.id
  end

end
