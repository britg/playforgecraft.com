class Event
  include Mongoid::Document
  include Mongoid::Timestamps

  MESSAGE_TYPE = "message"
  LOOT_TYPE = "loot"
  BOSS_TYPE = "boss"

  TYPES = [LOOT_TYPE, BOSS_TYPE]

  embedded_in :forge

  field :type
  field :message
  field :loot_id, :type => Integer
  field :enemy_id, :type => Integer

  class << self

    def for_loot loot
      new :type => LOOT_TYPE, :loot_id => loot.id
    end

  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:methods => [:boss]))
  end

  def to_css_class
    "#{type}"
  end

  def loot= loot
    self.loot_id = @loot.try(:id)
    @loot = Loot.find_by_id(loot_id)
  end

  def loot
    @loot||=Loot.unscoped.find_by_id(loot_id)
  end

  # Enemy

  def boss
    Enemy.find_by_id(self.enemy_id)
  end

end