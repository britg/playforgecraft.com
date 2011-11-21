class Battle
  include MongoMapper::Document

  MODES = [ :singleplayer, :multiplayer ]

  key :player_ids,    Array
  key :mode,          String
  key :finished,      Boolean, :default => false
  key :finish_reason  String
  key :winner_id,     Integer

  has_many :actions

  timestamps!

  validates_presence_of :player_ids
  validates_presence_of :mode
  validates_inclusion_of :mode, :in => MODES.map(&:to_s)

  before_create :choose_opponent, :if => :singleplayer?
  after_create :cast_heroes

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

  def singleplayer?
    mode == "singleplayer"
  end

  def multiplayer?
    mode == "multiplayer"
  end

  def winner
    Player.find_by_id(self.winner_id)
  end

  def first_player
    Player.find_by_id(player_ids.first)
  end

  def second_player
    return Opponent.find_by_id(player_ids.last) if singleplayer?
    return Player.find_by_id(player_ids.last) if multiplayer?
  end

  def forfeit forfeiter
    winner_id = (player_ids - [forfeiter.id]).first
    update_attributes(:finished => true, 
                      :finish_reason => 'forfeit',
                      :winner_id => winner_id)
  end

  #------

  def choose_opponent
    
  end

  def cast_heroes
    
  end

end

Battle.ensure_index :player_ids
