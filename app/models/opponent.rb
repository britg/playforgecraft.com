class Opponent
  include MongoMapper::Document

  key :name, String
  key :level, Integer

  class << self

    def opponent_for player
      create :name => NameGenerator.create,
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

  end

  def to_s
    name
  end

  def to_css_class
    "itemset"
  end

end
