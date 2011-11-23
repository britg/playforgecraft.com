class Battle
  include MongoMapper::Document

  MODES = [ :singleplayer, :multiplayer ]

  key :first_player_id,   Integer
  key :second_player_id,  String # Opponents may have string ids
  key :winner_id,         String
  key :loser_id,          String
  key :mode,              String
  key :finished,          Boolean, :default => false
  key :finish_reason,     String
  

  has_many :actions

  has_one :first_warrior, :class_name => "HeroSnapshot"
  has_one :first_thief, :class_name => "HeroSnapshot"
  has_one :first_ranger, :class_name => "HeroSnapshot"

  has_one :second_warrior, :class_name => "HeroSnapshot"
  has_one :second_thief, :class_name => "HeroSnapshot"
  has_one :second_ranger, :class_name => "HeroSnapshot"

  timestamps!

  validates_presence_of :mode
  validates_inclusion_of :mode, :in => MODES.map(&:to_s)

  before_create :choose_opponent, :if => :singleplayer?
  before_create :snapshot_heroes

  class << self
    
    def singleplayer
      sorted.where(:mode => :singleplayer)
    end

    def multiplayer
      sorted.where(:mode => :multiplayer)
    end

    def active
      sorted.where(:finished => false)
    end

    def finished
      sorted.where(:finished => true)
    end

    def sorted
      sort("created_at desc")
    end

  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:methods => [:first_player, :second_player, :plays]))
  end

  def plays
    Playbook.first.plays
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
    Opponent.find_by_id(self.winner_id)||Player.find_by_id(self.winner_id)
  end

  def loser
    Opponent.find_by_id(self.loser_id)||Player.find_by_id(self.loser_id)
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

  def result_for current_player
    return "victory" if winner_id.to_s == current_player.id.to_s
    "defeat"
  end

  def forfeit forfeiter
    loser_id = forfeiter.id
    winner_id = (first_player == forfeiter ? second_player_id : first_player_id)

    update_attributes(:finished => true, 
                      :finish_reason => 'forfeit',
                      :winner_id => winner_id,
                      :loser_id => loser_id)
  end

  # Callbacks

  def choose_opponent
    self.second_player = Opponent.opponent_for(self.first_player)
  end

  def snapshot_heroes
    self.snapshot_first_player_heroes
    self.generate_opponent_heroes if self.singleplayer?
    self.snapshot_second_player_heroes if self.multiplayer?
  end

  def snapshot_first_player_heroes
    self.first_warrior = HeroSnapshot.snapshot_of(self.first_player.warrior)
    self.first_thief = HeroSnapshot.snapshot_of(self.first_player.thief)
    self.first_ranger = HeroSnapshot.snapshot_of(self.first_player.ranger)
  end

  def snapshot_second_player_heroes
    self.second_warrior = HeroSnapshot.snapshot_of(self.second_player.warrior)
    self.second_thief = HeroSnapshot.snapshot_of(self.second_player.thief)
    self.second_ranger = HeroSnapshot.snapshot_of(self.second_player.ranger)
  end

  def generate_opponent_heroes
    self.second_warrior = Opponent.warrior_for(self.first_warrior)
    self.second_thief = Opponent.thief_for(self.first_thief)
    self.second_ranger = Opponent.ranger_for(self.first_ranger)
  end

end

Battle.ensure_index :first_player_id
Battle.ensure_index :second_player_id