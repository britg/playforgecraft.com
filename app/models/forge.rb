class Forge
  include Mongoid::Document

  field :mine_id, :type => Integer
  field :player_id, :type => Integer
  field :funds, :type => Integer
  field :complete, :type => Boolean, :default => false

  index [:player_id, :mine_id], :unique => true

  class << self

    def active
      where(:complete => false)
    end

  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:methods => [:id, :progress_percent]))
  end

  def to_s
    mine.to_s
  end

  def mine
    Mine.find(mine_id)
  end

  def player
    Player.find(player_id)
  end

  def loot
    Loot.where(:forge_id => to_param)
  end

  # Progress

  def progress_percent
    0
  end

end
