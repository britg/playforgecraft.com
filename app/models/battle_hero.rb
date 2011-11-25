class BattleHero
  include Mongoid::Document

  embedded_in :battle

  field :name
  field :owner_id
  field :owner_type
  field :job_id, :type => Integer
  field :job_name
  field :attack, :type => Integer
  field :defense, :type => Integer
  field :weapon1_id, :type => Integer
  field :weapon2_id, :type => Integer
  field :armor_id, :type => Integer
  field :leggings_id, :type => Integer
  field :alive, :type => Boolean, :default => true

  before_save :observe_death

  class << self

    def snapshot_of hero, owner
      {:name => hero.name,
       :owner_id => owner.id,
       :owner_type => (owner.class == Player ? 'player' : 'opponent'),
       :job_id => hero.hero_class_id,
       :job_name => hero.job.to_s,
       :attack => hero.attack,
       :defense => hero.defense,
       # :attack => 1,
       # :defense => 10,
       :weapon1_id => hero.weapon1.try(:id),
       :weapon2_id => hero.weapon2.try(:id),
       :armor_id => hero.armor.try(:id),
       :leggings_id => hero.leggings.try(:id)}
    end

  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:methods => [:id]))
  end

  def to_s
    name||job_name.titleize
  end

  def to_css_class
    job_name
  end

  def owner
    @owner ||= Opponent.find(owner_id) if owner_type == 'opponent'
    @owner ||= Player.find(owner_id)
  end

  def take_damage amount
    self.defense -= amount
  end

  def take_damage! amount
    self.take_damage amount
    self.save
  end

  def calculate_damage target
    attack
  end

  def alive?
    alive
  end

  def dead?
    !alive?
  end

  def should_die?
    defense <= 0 and alive?
  end

  def die
    self.defense = 0
    self.alive = false
    battle.log_death(self)
    dead?
  end

  def die!
    die
    save
  end

  def resurrect starting_defense=1
    self.defense = starting_defense
    self.alive = true
  end

  def resurrect! starting_defense=1
    resurrect starting_defense
    save
  end

  def auto_attack
    available_target = battle.available_target_for owner
    return unless available_target
    action = battle.actions.create :type => :attack,
                                  :player_id => owner.id,
                                  :player_type => 'opponent',
                                  :hero_id => self.id,
                                  :hero_type => self.job_name,
                                  :target_id => available_target.id,
                                  :target_type => available_target.job_name
    action.perform
    battle.add_processed_action(action)
  end

  #----

  def observe_death
    die if should_die?
    true
  end

end
