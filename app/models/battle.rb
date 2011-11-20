class Battle
  include MongoMapper::Document

  MODES = [ :singleplayer, :multiplayer ]

  key :player_ids,  Array
  key :mode,        String
  key :finished,    Boolean, :default => false
  key :winner_id,   Integer

  timestamps!

  validates_presence_of :player_ids
  validates_presence_of :mode
  validates_inclusion_of :mode, :in => MODES.map(&:to_s)

  class << self
    
    def singleplayer
      where(:mode => :singleplayer)
    end

    def multiplayer
      where(:mode => :multiplayer)
    end

  end

  def winner
    Player.find_by_id(self.winner_id)
  end

end

Battle.ensure_index :player_ids
