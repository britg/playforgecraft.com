class Game < ActiveRecord::Base

  TYPES = [:singleplayer, :multiplayer, :workorder]
  DEFAULT_TURNS = 50
  DEFAULT_ROWS = 12
  DEFAULT_COLS = 12

  belongs_to :challenger, :class_name => "Player"
  belongs_to :challengee, :class_name => "Player"
  belongs_to :winner, :class_name => "Player"
  belongs_to :loser, :class_name => "Player"

  has_many :tiles
  has_many :actions
  has_many :loot, :class_name => "Loot"
  has_many :items, :through => :loot

  validates_inclusion_of :game_type, :in => TYPES

  class << self

    # Scopes
    def in_progress
      where(["challenger_turns_remaining > 0"])
    end

    def singleplayer
      where(:game_type => :singleplayer)
    end

    def multiplayer
      where(:game_type => :multiplayer)
    end

    def workorder
      where(:game_type => :workorder)
    end

  end

  def is_singleplayer?
    :singleplayer == game_type.to_sym
  end

  def is_multiplayer?
    :multiplayer == game_type.to_sym
  end

  def is_workorder?
    :workorder == game_type.to_sym
  end

  def serializeable_hash opts = {}
    super((opts||{}).merge(:methods => [:finished?]))
  end

  def has_player? player
    player.present? and \
      (challenger_id == player.id or challengee_id == player.id)
  end

  def spend_action
    decrement! :challenger_turns_remaining
    self
  end

  def consume forged_tiles
    forged_tiles.update_all :consumed => true
    @changed_tiles = []
    gravitize
    @changed_tiles.map(&:to_sync)
  end

  def gravitize
    @tile_cache = tiles.dup

    DEFAULT_COLS.times do |x|
      @col_tiles = @tile_cache.select{ |t| t.x == x }
      fill_col(x) if @col_tiles.count < DEFAULT_ROWS
    end
    #tiles.map(&:to_sync)
  end

  def fill_col(x)
    missing_rows = []
    DEFAULT_ROWS.times do |y|
      exists = @col_tiles.select{ |t| t.y == y }
      missing_rows << y unless exists.any?
    end

    first_missing_row = missing_rows.first
    move_down = @col_tiles.select{ |t| t.y < first_missing_row }
    move_down.each do |t|
      t.increment!(:y, missing_rows.count)
      @changed_tiles << t
    end

    missing_rows.count.times do |i|
      @changed_tiles << generate_tile(x, i)
    end
  end

  def generate_tile(x, y)
    ore = Ore.random
    self.tiles.create(:x => x, :y => y, :ore => ore)
  end

  def forge class_name, ore_name, accuracy, player
    puts class_name
    puts ore_name
    classification = Classification.find_by_name(class_name.capitalize)
    ore = Ore.find_by_name(ore_name.capitalize)

    loot = Loot.generate(classification, ore, accuracy, player.level)
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
    loot.destroy_all

    init_tiles
  end

  def finished?
    challenger_turns_remaining <= 0
  end

  def loot_list rarity = nil
    return items unless rarity.present?
    items.send(rarity)
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
