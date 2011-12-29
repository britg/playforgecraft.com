class Player < ActiveRecord::Base

  RESERVED_NAMES = ["ladder", "player", "players", "battles", "forges", "map", "armory", "items", "item", "loot", "loots", "admin", "users", "user", "session", "sessions", "ore", "ores", "classifications", "classification", "rarity", "rarities", "hero", "heroes", "topic", "topics", "menu", "settings", "admin_logout", "login", "logout", "register", "forum", "home", "contact", "about"]

  belongs_to :user
  belongs_to :zone
  belongs_to :mine
  has_one :setting

  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false
  validates_presence_of :url_name
  validates_uniqueness_of :url_name, :case_sensitive => false
  validates :url_name, :exclusion => { :in => Player::RESERVED_NAMES, :message => "Sorry, your player name is a reserved word" }

  has_many :loot, :class_name => "Loot"
  has_many :items, :through => :loot, :uniq => true
  has_many :heroes
  has_many :slots, :class_name => "HeroSlot"

  has_attached_file :avatar,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :full => ["200x200#", :jpg], :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  before_validation :generate_url_name
  after_create :create_setting, :update_score!

  accepts_nested_attributes_for :setting

  class << self

    def range(range_id)
      "#{(range_id.to_i*10+1)}-#{(range_id.to_i+1)*10}"
    end

    def update_scores!
      Player.all.map(&:update_score!)
    end

  end

  def to_s
    "#{name}"
  end

  def admin?
    user.try(:admin?)
  end

  def to_param
    url_name
  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:only => [:id, :name, :level, :coins], :methods => [:zone, :forge, :setting]))
  end

  def generate_url_name
    self.url_name = self.name.gsub /[^a-zA-Z0-9\-]+/, '-'
  end

  def generate_url_name!
    generate_url_name
    save
  end

  def to_css_class
    'advanced'
  end

  def title
    "Novice Crafstman"
  end

  def purchase!(cost)
    return false if cost > forge.funds
    forge.inc(:funds, -cost)
    true
  end

  def sell!(cost)
    forge.inc(:funds, cost)
    true
  end

  # Heroes

  def hero_for_class hero_class
    heroes.where(:hero_class_id => hero_class).first
  end

  def warrior
    heroes.where(:hero_class_id => HeroClass.warrior).first
  end

  def thief
    heroes.where(:hero_class_id => HeroClass.thief).first
  end

  def ranger
    heroes.where(:hero_class_id => HeroClass.ranger).first
  end

  def level_range
    ((level-1) / 10)
  end

  # Battles

  def battles
    Battle.where(:first_player_id => self.id)
  end

  def active_battle
    battles.singleplayer.active.first
  end

  def won? battle
    battle.winner == self
  end

  # Zones

  def can_access_zone? target_zone
    false
  end

  # Mines

  def travel_to target_mine
    self.update_attributes(:mine => target_mine, :zone => target_mine.zone)
    start_forge(target_mine) unless has_forge?(target_mine)
  end

  def completed_mine? mine
    completed_mines.include? mine
  end

  def completed_mines
    @completed_mines ||= forges.where(:complete => true).map(&:mine)
  end

  def can_travel_to? target_mine
    target_mine.required_mines.each do |req_mine|
      return false unless self.completed_mines.include?(req_mine)
    end
    true
  end

  # Forges

  def practice_forge
    forges.first
  end

  def forges
    Forge.where(:player_id => id)
  end

  def forge
    return nil unless mine_id.present?
    Forge.where(:player_id => id, :mine_id => mine_id).first
  end

  def forge_for target_mine
    forges.where(:mine_id => target_mine.try(:id)).first
  end

  def start_forge target_mine
    return false unless target_mine.try(:id)
    forges.create :mine_id => target_mine.try(:id),
                  :zone_id => target_mine.zone.try(:id),
                  :requires_funding => target_mine.requires_funding?,
                  :funds => target_mine.starting_funds,
                  :battle_chance => target_mine.battle_chance
  end

  def has_forge? target_mine
    forge_for(target_mine).present?
  end

  def can_forge_at? forge
    return unless forge.player_id == self.id
    !forge.complete?
  end

  # Loot

  def best_set
    [best_sword, best_axe, best_crossbow, best_shield, best_leggings, best_tunic].compact
  end

  def best_loot
    loot.includes(:item).order("loots.rating desc").limit(1)
  end

  def best_sword
    best_loot.where('items.classification_id' => Classification.sword).first
  end

  def best_axe
    best_loot.where('items.classification_id' => Classification.axe).first
  end

  def best_crossbow
    best_loot.where('items.classification_id' => Classification.crossbow).first
  end

  def best_shield
    best_loot.where('items.classification_id' => Classification.shield).first
  end

  def best_leggings
    best_loot.where('items.classification_id' => Classification.leggings).first
  end

  def best_tunic
    best_loot.where('items.classification_id' => Classification.tunic).first
  end

  def defeat_offering
    offering = loot.includes(:item).where("items.rarity_id" => Rarity.advanced).random
    unless offering.present?
      offering = loot.random
    end
    offering
  end

  # Score

  def rare_items
    @rare_items ||= items.rare.uniq.count
  end

  def rare_items_percent
    @rare_items_percent ||= (rare_items.to_f / Item.rare.count.to_f * 100).round rescue 0
  end

  def epic_items
    @epic_items ||= items.epic.uniq.count
  end

  def epic_items_percent
    @epic_items_percent ||= (epic_items.to_f / Item.epic.count.to_f * 100).round rescue 0
  end

  def total_items
    @total_items ||= items.uniq.count
  end

  def total_items_percent
    @total_items_percent ||= (total_items.to_f / Item.all.count.to_f * 100).round rescue 0
  end

  def forges_complete
    @forges_complete ||= forges.completed.count
  end

  def forges_complete_percent
    @forges_complete_percent ||= (forges_complete.to_f / Mine.count.to_f * 100).round rescue 0
  end

  def battles_won_count
    count = 0
    forges.each do |f|
      count += f.events.battles_won.count
    end
    count
  end

  def battles_lost_count
    count = 0
    forges.each do |f|
      count += f.events.battles_lost.count
    end
    count
  end

  def battles_won_percent
    @battles_won_percent ||= (battles_won_count.to_f / (battles_won_count + battles_lost_count) * 100).round rescue 0
  end

  def score
    @score ||= (Score.where(:player_id => self.id).first || Score.create(:player_id => self.id))
  end

  def calculate_score
    total_items + (rare_items * 16) + (epic_items * 26) + (forges_complete * 76) + (battles_won_count*20)
  end

  def update_score!
    score.update_attributes :score => calculate_score,
                            :battles_won => battles_won_count,
                            :battles_lost => battles_lost_count,
                            :battles_won_percent => battles_won_percent,
                            :forges_complete => forges_complete,
                            :forges_complete_percent => forges_complete_percent,
                            :total_items => total_items,
                            :total_items_percent => total_items_percent,
                            :rare_items => rare_items,
                            :rare_items_percent => rare_items_percent,
                            :epic_items => epic_items,
                            :epic_items_percent => epic_items_percent
  end

end
