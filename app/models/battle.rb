class Battle
  include MongoMapper::Document

  MODES = [ :singleplayer, :multiplayer ]

  key :first_player_id,   Integer
  key :second_player_id,  String # Opponents have string ids
  key :winner_id,         Integer
  key :mode,              String
  key :finished,          Boolean, :default => false
  key :finish_reason,     String
  

  has_many :actions

  timestamps!

  validates_presence_of :first_player_id
  validates_presence_of :second_player_id
  validates_presence_of :mode
  validates_inclusion_of :mode, :in => MODES.map(&:to_s)

  before_validation :choose_opponent, :if => :singleplayer?
  after_create :snapshot_heroes

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

  end

  def singleplayer?
    mode == "singleplayer"
  end

  def multiplayer?
    mode == "multiplayer"
  end

  def active?
    !finished?
  end

  def winner
    Player.find_by_id(self.winner_id)
  end

  def first_player
    Player.find_by_id(self.first_player_id)
  end

  def first_player= player
    self.first_player_id = player.id
  end

  def second_player
    return Opponent.find_by_id(self.second_player_id) if singleplayer?
    return Player.find_by_id(self.second_player_id) if multiplayer?
  end

  def second_player= player
    self.second_player_id = player.id
  end

  def forfeit forfeiter
    winner_id = (first_player.id == forfeiter.id ? second_player_id : first_player_id)
    update_attributes(:finished => true, 
                      :finish_reason => 'forfeit',
                      :winner_id => winner_id)
  end

  # Callbacks

  def choose_opponent
    self.second_player = Opponent.opponent_for(self.first_player)
  end

  def cast_heroes
    
  end

end

Battle.ensure_index :first_player_id
Battle.ensure_index :second_player_id