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

  def to_sync
    self
  end

  def has_player? player
    player.present? and \
      (challenger_id == player.id or challengee_id == player.id)
  end

  def spend_action
    decrement! :challenger_turns_remaining
    to_sync
  end

  def consume forged_tiles
    forged_tiles.update_all :consumed => true
    gravitize
  end

  def gravitize
    @tile_cache = tiles.dup

    DEFAULT_COLS.times do |x|
      @col_tiles = @tile_cache.select{ |t| t.x == x }
      fill_col(x) if @col_tiles.count < DEFAULT_ROWS
    end

    tiles.map(&:to_sync)
  end

  def fill_col(x)
    puts "filling col #{x}"
    missing_rows = []
    puts "col tiles is #{@col_tiles.map(&:y)}"
    DEFAULT_ROWS.times do |y|
      exists = @col_tiles.select{ |t| t.y == y }
      missing_rows << y unless exists.any?
    end

    puts "missing rows #{missing_rows.inspect}"

    first_missing_row = missing_rows.first
    move_down = @col_tiles.select{ |t| t.y < first_missing_row }
    move_down.each do |t|
      t.increment!(:y, missing_rows.count)
    end

    missing_rows.count.times do |i|
      generate_tile(x, i)
    end
  end

  def generate_tile(x, y)
    ore = Ore.random
    self.tiles.create(:x => x, :y => y, :ore => ore)
  end

  def reset!
    update_attributes :start_turns => Game::DEFAULT_TURNS,
                      :challenger_turns_remaining => Game::DEFAULT_TURNS,
                      :challenger_attack_score => 0,
                      :challenger_defense_score => 0,
                      :challengee_attack_score => 0,
                      :challengee_defense_score => 0
    tiles.destroy_all
    actions.destroy_all

    init_tiles
  end

  protected

  def init_tiles
    DEFAULT_ROWS.times do |y|
      DEFAULT_COLS.times do |x|
        generate_tile(x, y)
      end
    end
  end

end
