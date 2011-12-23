class Event
  include Mongoid::Document
  include Mongoid::Timestamps

  MESSAGE_TYPE = "message"
  LOOT_TYPE = "loot"
  BATTLE_TYPE = "battle"

  TYPES = [LOOT_TYPE, BATTLE_TYPE]

  embedded_in :forge

  field :type
  field :loot_id, :type => Integer
  field :message

  class << self

    def for_loot loot
      new :type => LOOT_TYPE, :loot_id => loot.id
    end

  end

  def loot= loot
    self.loot_id = @loot.try(:id)
    @loot = Loot.find_by_id(loot_id)
  end

  def loot
    @loot||=Loot.find_by_id(loot_id)
  end

end