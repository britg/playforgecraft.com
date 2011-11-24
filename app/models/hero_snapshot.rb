class HeroSnapshot
  include Mongoid::Document

  embedded_in :battle

  field :name
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

    def snapshot_of hero
      {:name => hero.name,
       :job_id => hero.hero_class_id,
       :job_name => hero.job.to_s,
       :attack => hero.attack,
       :defense => hero.defense,
       :weapon1_id => hero.weapon1.try(:id),
       :weapon2_id => hero.weapon2.try(:id),
       :armor_id => hero.armor.try(:id),
       :leggings_id => hero.leggings.try(:id)}
    end

  end

  def to_s
    name||job_name.titleize
  end

  def to_css_class
    job_name
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

  #----

  def observe_death
    die if should_die?
    true
  end

end
