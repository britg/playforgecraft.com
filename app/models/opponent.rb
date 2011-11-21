class Opponent
  include MongoMapper::Document

  key :name, String
  key :level, Integer

  class << self

    def opponent_for player
      o = self.find_by_level(player.level)
      o ||= create :name => "Ragnar of Thane",
                   :level => player.level
    end

  end

  def to_css_class
    "advanced"
  end

end
