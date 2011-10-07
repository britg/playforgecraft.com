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
  has_many :actions

  before_create :defaults

  def has_player? player
    player.present? and \
      (challenger_id == player.id or challengee_id == player.id)
  end

  def reset!
    update_attributes :start_turns => Game::DEFAULT_TURNS,
                      :challenger_attack_score => 0,
                      :challenger_defense_score => 0,
                      :challengee_attack_score => 0,
                      :challengee_defense_score => 0
    tiles.destroy_all
    actions.destroy_all

    init_tiles
  end

  protected

  def defaults
    self.start_turns = Game::DEFAULT_TURNS
  end

  def init_tiles
    DEFAULT_ROWS.times do |r|
      DEFAULT_COLS.times do |c|
        ore = Ore.random
        self.tiles.create(:x => c, :y => r, :ore => ore)
      end
    end
  end

end
