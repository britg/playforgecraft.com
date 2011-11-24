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

  before_create :perform

  def serializable_hash opts={}
    super((opts||{}).merge(:methods => [:player, :hero, :target]))
  end

  def player
    return nil unless player_id.present?
    @player ||= Opponent.find(player_id) if player_type == 'opponent'
    @player ||= Player.find(player_id)
  end

  def hero
    return nil unless hero_id.present?
    @hero ||= battle.hero_by_id(hero_id)
  end

  def target
    return nil unless target_id.present?
    @target ||= battle.hero_by_id(target_id)
  end

  def attack?
    self.type.to_s == 'attack'
  end

  #----

  def perform
    perform_attack if attack?
  end

  def perform_attack
    self.damage_dealt = hero.calculate_damage(target)
    target.take_damage! self.damage_dealt
  end

end
