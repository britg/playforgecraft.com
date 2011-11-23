class Action
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :battle

  TYPES = [ :message, :attack, :notification ]

  field :type
  field :play, :type => Integer
  field :player_id
  field :player_type
  field :hero_id
  field :hero_type
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
    return nil unless hero_type.present?
    @hero ||= battle.send("first_#{hero_type}")
  end

  def target
    return nil unless target_type.present?
    @target ||= battle.send("second_#{hero_type}")
  end

  def is_attack?
    self.type.to_s == 'attack'
  end

  #----

  def run_action
    self.damage_dealt = 10
  end

end
