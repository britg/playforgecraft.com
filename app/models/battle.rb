class Battle
  include Mongoid::Document
  include Mongoid::Timestamps

  MODES = [ :singleplayer, :multiplayer ]

  field :first_player_id, :type => Integer
  field :second_player_id
  field :winner_id
  field :winner_type
  field :loser_id
  field :loser_type
  field :mode
  field :finished, :type => Boolean, :default => false
  field :finish_reason

  index :first_player_id
  index :second_player_id
  
  embeds_many :actions
  embeds_many :battle_heroes

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
      desc("created_at")
    end

  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:methods => [:first_player, :second_player, :plays, :first_warrior, :second_warrior, :first_thief, :second_thief, :first_ranger, :second_ranger]))
  end

  def conditions
    {
      :finished => finished,
      :finish_reason => finish_reason,
      :winner_id => winner_id,
      :winner_type => winner_type,
      :loser_id => loser_id,
      :loser_type => loser_type
    }
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
    @winner ||= Opponent.find(winner_id) if winner_type == 'opponent'
    @winner ||= Player.find(winner_id)
  end

  def loser
    @loser ||= Opponent.find(self.loser_id) if loser_type == 'opponent'
    @loser ||= Player.find(self.loser_id)
  end

  def first_player
    @first_player ||= Player.find(self.first_player_id)
  end

  def first_player= player
    self.first_player_id = player.id
  end

  def second_player
    (@second_player ||= Opponent.find(self.second_player_id)) if singleplayer?
    (@second_player ||= Player.find(self.second_player_id)) if multiplayer?
    @second_player
  end

  def second_player= player
    self.second_player_id = player.id
  end

  def result_for current_player
    return "victory" if winner_id.to_s == current_player.id.to_s
    "defeat"
  end

  def player_by_id ident
    return first_player if (ident.to_s == first_player_id)
    return second_player
  end

  def first_warrior
    @first_warrior ||= \
    battle_heroes.where(:owner_id => first_player_id, :job_name => "warrior").first
  end

  def first_thief
    @first_thief ||= \
    battle_heroes.where(:owner_id => first_player_id, :job_name => "thief").first
  end

  def first_ranger
    @first_ranger ||= \
    battle_heroes.where(:owner_id => first_player_id, :job_name => "ranger").first
  end

  def second_warrior
    @second_warrior ||= \
    battle_heroes.where(:owner_id => second_player_id, :job_name => "warrior").first
  end

  def second_thief
    @second_thief ||= \
    battle_heroes.where(:owner_id => second_player_id, :job_name => "thief").first
  end
  
  def second_ranger
    @second_ranger ||= \
    battle_heroes.where(:owner_id => second_player_id, :job_name => "ranger").first
  end

  def find_hero ident
    battle_heroes.where(:_id => ident).first    
  end

  def available_target default
    return default if default.alive?
    [second_warrior, second_thief, second_ranger].each do |hero|
      return hero if hero.alive?
    end
  end

  def forfeit forfeiter
    loser_id = forfeiter.id
    winner_id = (first_player == forfeiter ? second_player_id : first_player_id)

    update_attributes(:finished => true, 
                      :finish_reason => 'forfeit',
                      :winner_id => winner_id,
                      :winner_type => "opponent",
                      :loser_id => loser_id,
                      :loser_type => "player")
  end

  def reset
    actions.destroy_all
  end

  def processed_actions
    @processed_actions ||= []
  end

  def add_processed_action action
    @processed_actions ||= []
    @processed_actions << action
  end

  def process_action player, action_data
    action_data.merge!({"player_id" => player.id, 
                        "player_type" => 'player'})
    action = actions.create action_data
    add_processed_action(action)
    action.perform
    check_conditions
  end

  def first_player_alive?
    [first_warrior, first_thief, first_ranger].each do |hero|
      return true if hero.alive?
    end
    false
  end

  def second_player_alive?
    [second_warrior, second_thief, second_ranger].each do |hero|
      return true if hero.alive?
    end
    false
  end

  def check_conditions
    end_battle unless first_player_alive? and second_player_alive?
  end

  def end_battle
    winner = (first_player_alive? ? first_player : second_player)
    loser = (first_player_alive? ? second_player : first_player)

    update_attributes(:finished => true,
                      :finish_reason => 'complete',
                      :winner_id => winner.id,
                      :winner_type => (winner.class == Player ? 'player' : 'opponent'),
                      :loser_id => loser.id,
                      :loser_type => (loser.class == Player ? 'player' : 'opponent'))
    
    end_action = self.actions.create :type => :end
    add_processed_action(end_action)
  end

  def log_death(hero)
    action = actions.create :type => :notification,
                            :message => "#{hero} has died!",
                            :play => current_play
    add_processed_action(action)
  end

  def current_play
    actions.last.try(:play)||0
  end

  # Callbacks

  def choose_opponent
    self.second_player = Opponent.opponent_for(self.first_player)
  end

  def snapshot_heroes
    snapshot_first_player_heroes
    generate_opponent_heroes if singleplayer?
    snapshot_second_player_heroes if multiplayer?
  end

  def snapshot_first_player_heroes
    first_player.heroes.each do |hero|
      battle_heroes.build BattleHero.snapshot_of(hero, first_player)
    end
  end

  def snapshot_second_player_heroes
    second_player.heroes.each do |hero|
      battle_heroes.build BattleHero.snapshot_of(hero, first_player)
    end
  end

  def generate_opponent_heroes
    [first_warrior, first_thief, first_ranger].each do |battle_hero|
      battle_heroes.build Opponent.hero_opponent_attributes(battle_hero, second_player)
    end
  end

end