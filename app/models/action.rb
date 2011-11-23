class Action
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :battle

  TYPES = [ :message, :attack, :notification ]

  # key :message,     String
  # key :player_id,   String
  # key :player_name, String
  # key :hero_id,     String
  # key :hero_name,   String
  # key :type,        String
  # key :play,        Integer
  # key :target_id,   String
  # key :target_name, String
  # key :damage_dealt, Integer

  field :type
  field :play, :type => Integer
  field :player_id
  field :player_type
  field :hero_snapshot_id
  field :target_id
  field :target_type
  field :message
  field :damage_dealt, :type => Integer

  before_create :run_action

  def serializable_hash opts={}
    super((opts||{}).merge(:methods => [:to_log]))
  end

  def to_s
    to_log
  end

  def player
    return nil unless player_id.present?
    @player ||= Opponent.find(player_id) if player_type == 'opponent'
    @player ||= Player.find(player_id)
  end

  def hero
    return nil unless hero_snapshot_id.present?
    @hero ||= HeroSnapshot.find(hero_snapshot_id)
  end

  def target
    return nil unless target_id.present?
    @target ||= Opponent.find(target_id) if target_type == 'opponent'
    @target ||= Player.find(target_id)
  end

  def to_log
    "#{player}: #{message}"
  end

  def is_attack?
    self.type.to_s == 'attack'
  end

  #----

  def run_action
    self.damage_dealt = 10
  end

end
