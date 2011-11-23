class Opponent
  include Mongoid::Document

  # key :name, String
  # key :level, Integer

  field :name
  field :level, :type => Integer

  class << self

    def opponent_for player
      rand = Random.new
      name = group_names[rand(group_names.count-1)]
      create :name => name,
             :level => player.level
    end

    def warrior_for opposing_warrior
      warrior = HeroSnapshot.new(opposing_warrior.attributes)
      warrior.name = NameGenerator.create
      warrior
    end

    def thief_for opposing_thief
      thief = HeroSnapshot.new(opposing_thief.attributes)
      thief.name = NameGenerator.create
      thief
    end

    def ranger_for opposing_ranger
      ranger = HeroSnapshot.new(opposing_ranger.attributes)
      ranger.name = NameGenerator.create
      ranger
    end

    def group_names
      [ "Travelling Bandits",
        "Highwaymen",
        "Angry Dwarves",
        "Mercenaries",
        "Kragg Caravan",
        "Thjodrynn's Vanguard",
        "Orc Scouts",
        "Pirates",
        "Forsworn Legion",
        "Escaped Miners",
        "Shamblers"
      ]
    end

  end

  def to_s
    name
  end

  def to_css_class
    "itemset"
  end

end
