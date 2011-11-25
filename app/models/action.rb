class Action
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :battle

  TYPES = [ :message, :attack, :notification, :end ]

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
  field :conditions

  before_create :snapshot_conditions

  def serializable_hash opts={}
    super((opts||{}).merge(:methods => [:id, :player, :hero, :targetted]))
  end

  def player
    return nil unless player_id.present?
    @player ||= Opponent.find(player_id) if player_type == 'opponent'
    @player ||= Player.find(player_id)
  end

  def hero
    return nil unless hero_id.present?
    @hero ||= battle.find_hero(hero_id)
  end

  # 'target' is a reserved method
  def targetted
    return nil unless target_id.present?
    @targetted ||= battle.find_hero(target_id)
  end

  def update_targetted hero
    self.target_id = hero.id
    self.target_type = hero.job_name
    @targetted = nil
  end

  def attack?
    self.type.to_s == 'attack'
  end

  def end?
    self.type.to_s == 'end'
  end

  #----

  def perform
    perform_attack if attack?
  end

  def perform_attack
    actual_target = battle.available_target(targetted)
    self.update_targetted(actual_target)
    self.damage_dealt = hero.calculate_damage(self.targetted)
    self.targetted.take_damage! damage_dealt
  end

  def snapshot_conditions
    self.conditions = battle.try(:conditions)
  end

end
