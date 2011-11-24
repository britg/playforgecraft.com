class Opponent
  include Mongoid::Document
  
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
      atts = opposing_warrior.attributes.dup
      atts.delete("_id")
      warrior = HeroSnapshot.new(atts)
      warrior.name = NameGenerator.create
      warrior
    end

    def thief_for opposing_thief
      atts = opposing_thief.attributes.dup
      atts.delete("_id")
      thief = HeroSnapshot.new(atts)
      thief.name = NameGenerator.create
      thief
    end

    def ranger_for opposing_ranger
      atts = opposing_ranger.attributes.dup
      atts.delete("_id")
      ranger = HeroSnapshot.new(atts)
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
