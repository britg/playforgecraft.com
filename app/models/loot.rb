class Loot < ActiveRecord::Base

  belongs_to :player
  belongs_to :game
  belongs_to :action
  belongs_to :item

  def serializable_hash(opts = {})
    super((opts||{}).merge( :only => [:id, :attack, :defense],
                            :methods => [:item_attributes]))
  end

  def item_attributes
    {
      :name => item.name,
      :description => item.description,
      :icon_url => item.icon_url,
      :type => item.type,
      :param => item.to_param
    }
  end

  class << self

    def generate classification, ore, accuracy, level
      item = Item.where(:classification_id => classification, 
                        :ore_id => ore).where(["level <= ?", level]).first

      return nil unless item
      loot = Loot.new( :item => item, 
                          :attack => item.attack_max, 
                          :defense => item.defense_max )
    end

  end

end
