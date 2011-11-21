class Battle
  include MongoMapper::Document

  MODES = [ :singleplayer, :multiplayer ]

  key :player_ids,  Array
  key :mode,        String
  key :finished,    Boolean, :default => false
  key :winner_id,   Integer

  has_many :actions

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

    def active
      where(:finished => false)
    end

    def singleplayer_for player
      if player.battles.singleplayer.active.any?
        return player.battles.singleplayer.active.first
      end

      Battle.create :player_ids => [player.id],
                    :mode => :singleplayer
    end

  end

  def winner
    Player.find_by_id(self.winner_id)
  end

end

Battle.ensure_index :player_ids
