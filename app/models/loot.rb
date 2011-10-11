class Loot < ActiveRecord::Base

  default_scope order("id desc")

  belongs_to :player
  belongs_to :game
  belongs_to :action
  belongs_to :item

  after_create :update_score

  def serializable_hash(opts = {})
    super((opts||{}).merge( :only => [:id, :attack, :defense],
                            :methods => [:item_attributes]))
  end

  def item_attributes
    {
      :name => item.name,
      :description => item.description,
      :icon_url => item.icon_url,
      :type => item.type.downcase,
      :param => item.to_param
    }
  end

  def to_css_classes
    item.type.downcase rescue ""
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

  class << self

    def generate classification, ore, accuracy, level
      item = roll classification, ore, accuracy, level
      return nil unless item

      loot = Loot.new( :item => item )
      loot.set_stats accuracy
      loot
    end

    def roll classification, ore, accuracy, level
      # STUB
      puts "Rolling loot for #{ore} #{classification}"
      item = Item.where(:classification_id => classification, :ore_id => ore).random
    end

  end

  def set_stats accuracy
    # STUB
    self.attack = self.item.attack_max
    self.defense = self.item.defense_max
  end

  def update_score
    game.increment(:challenger_attack_score, attack) if attack
    game.increment(:challenger_defense_score, defense) if defense
  end

end
