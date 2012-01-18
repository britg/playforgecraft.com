class Skill
  include Mongoid::Document
  field :player_id, :type => Integer

  field :accuracy, :type => Integer, :default => 0
  field :craftsmanship, :type => Integer, :default => 0
  field :perception, :type => Integer, :default => 0

  field :available_points, :type => Integer, :default => 0

  field :gloves, :type => Boolean, :default => false
  field :apron, :type => Boolean, :default => false
  field :goggles, :type => Boolean, :default => false
  field :hammer, :type => Boolean, :default => false

  index :player_id, :unique => true

  def player
    @player ||= Player.find_by_id(player_id)
  end

  def increase skill
    return unless available_points > 0
    case skill
    when 'accuracy'       then inc(:accuracy, 1)
    when 'craftsmanship'  then inc(:craftsmanship, 1)
    when 'perception'     then inc(:perception, 1)
    end
    inc(:available_points, -1)
  end

  def gloves?
    gloves
  end

  def apron?
    apron
  end

  def goggles?
    goggles
  end

  def hammer?
    hammer
  end

  def reward_accessories
    reward_gloves if player.level >= 4
    reward_apron if player.level >= 7
    reward_goggles if player.level >= 9
    reward_hammer if player.level >= 10
  end

  def reward_gloves
    return if gloves?
    update_attributes(:gloves => true, :accuracy => accuracy + 1)
  end

  def reward_apron
    return if apron?
    update_attributes(:apron => true, :craftsmanship => craftsmanship + 1)
  end

  def reward_goggles
    return if goggles?
    update_attributes(:goggles => true, :perception => perception + 1)
  end

  def reward_hammer
    return if hammer?
    update_attributes(:hammer => true, 
                      :accuracy => accuracy + 1,
                      :craftsmanship => craftsmanship + 1,
                      :perception => perception + 1)
  end

end
