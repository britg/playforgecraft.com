class Loot < ActiveRecord::Base

  default_scope order("id desc")

  belongs_to :player
  belongs_to :game
  belongs_to :action
  belongs_to :item

  after_create :update_score

  validates_presence_of :item

  class << self

    def generate classification, ore, accuracy, level
      item = roll classification, ore, accuracy, level
      return nil unless item

      loot = Loot.new( :item => item )
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
      :param => item.to_param
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

  def set_stats accuracy
    # STUB
    self.attack = self.item.attack_max
    self.defense = self.item.defense_max
  end

  def update_score
    return unless game
    game.increment(:challenger_attack_score, attack) if attack
    game.increment(:challenger_defense_score, defense) if defense
  end

end
