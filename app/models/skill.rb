class Skill
  include Mongoid::Document
  field :player_id, :type => Integer

  field :accuracy, :type => Integer, :default => 0
  field :craftsmanship, :type => Integer, :default => 0
  field :perception, :type => Integer, :default => 0

  field :gloves, :type => Boolean, :default => false
  field :apron, :type => Boolean, :default => false
  field :goggles, :type => Boolean, :default => false

  index :player_id, :unique => true

  def player
    Player.find_by_id(player_id)
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

end
