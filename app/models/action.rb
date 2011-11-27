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
  field :hero_conditions
  field :target_id
  field :target_type
  field :target_conditions
  field :message
  field :damage_dealt, :type => Integer
  field :conditions

  before_create :snapshot_battle_conditions

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

  def perform
    perform_attack if attack?
    snapshot_hero_conditions
  end

  def perform_attack
    actual_target = battle.available_target_for(player, targetted)
    return unless actual_target.present?

    self.update_targetted(actual_target)
    self.update_attributes(:damage_dealt => hero.calculate_damage(self.targetted))
    self.targetted.take_damage! self.damage_dealt
  end

  def snapshot_battle_conditions
    self.conditions = battle.try(:conditions)
  end

  def snapshot_hero_conditions
    self.hero_conditions = hero.try(:attributes).try(:dup)
    self.target_conditions = targetted.try(:attributes).try(:dup)
  end

end
