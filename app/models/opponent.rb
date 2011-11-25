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

    def hero_opponent_attributes hero, owner
      atts = hero.attributes.dup
      atts.delete("_id")
      atts["owner_id"] = owner.id
      atts["owner_type"] = "opponent"
      atts["name"] = NameGenerator.create
      atts
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
