class Game < ActiveRecord::Base

  TYPES = [:singleplayer, :multiplayer, :freeplay]
  DEFAULT_TURNS = 100
  DEFAULT_ROWS = 12
  DEFAULT_COLS = 12

  belongs_to :challenger, :class_name => "Player"
  belongs_to :challengee, :class_name => "Player"
  belongs_to :winner, :class_name => "Player"
  belongs_to :loser, :class_name => "Player"

  has_many :tiles
  has_many :turns

  def init_tiles
    DEFAULT_ROWS.times do |r|
      DEFAULT_COLS.times do |c|
        ore = Ore.random
        self.tiles.build(:x => c, :y => r, :ore => ore)
      end
    end
  end

end
