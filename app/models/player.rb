class Player < ActiveRecord::Base

  RESERVED_NAMES = ["ladder", "player", "players", "battles", "forges", "map", "armory", "items", "item", "loot", "loots", "admin", "users", "user", "session", "sessions", "ore", "ores", "classifications", "classification", "rarity", "rarities", "hero", "heroes", "topic", "topics", "menu", "settings", "admin_logout", "login", "logout", "register", "forum", "home", "contact", "about"]

  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false
  validates_presence_of :url_name
  validates_uniqueness_of :url_name, :case_sensitive => false
  validates :url_name, :exclusion => { :in => Player::RESERVED_NAMES, :message => "Sorry, your player name is a reserved word" }

  belongs_to :user
  has_one :setting
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
    super((opts||{}).merge(:only => [:id, :name, :level], :methods => [:setting]))
  end

  def generate_url_name
    self.url_name = self.name.gsub /[^a-zA-Z0-9\-]+/, '-'
  end

  def generate_url_name!
    generate_url_name
    save
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

  def empty_slots?
    slots.each do |s|
      return true if s.empty?
    end
    false
  end

  def defense
    total = 0
    heroes.each do |h|
      total += h.defense
    end
    total
  end

  # Mines

  def completed_mine? mine
    completed_mines.include? mine
  end

  def completed_mines
    @completed_mines ||= forges.where(:complete => true).map(&:mine)
  end

  def can_mine_at? mine
    mine.level <= level
  end

  # Forges

  def forges
    Forge.where(:player_id => id)
  end

  def forge
    forges.where(:level => level).first
  end

  def forge_for mine
    forges.where(:mine_id => mine.try(:id)).first
  end

  def start_forge mine
    return false unless mine.try(:id)
    forges.create :mine_id => mine.id,
                  :level => mine.level,
                  :zone_id => mine.zone.id
  end

  def has_forge? mine
    forge_for(mine).present?
  end

  def can_forge_at? forge
    return false unless forge.player_id == self.id
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

  # Score
  def advanced_items
    @advanced ||= items.advanced.uniq.count
  end

  def rare_items
    @rare_items ||= items.rare.uniq.count
  end

  def epic_items
    @epic_items ||= items.epic.uniq.count
  end

  def total_items
    @total_items ||= items.uniq.count
  end

  def forges_complete
    @forges_complete ||= forges.completed.count
  end

  def bosses_complete
    @bosses_complete ||= 0
  end

  def score
    @score ||= (Score.where(:player_id => self.id).first || Score.create(:player_id => self.id))
  end

  def calculate_score
    total_items + \
    (rare_items * 8) + \
    (rare_items * 16) + \
    (epic_items * 26) + \
    (forges_complete * 76) + \
    (bosses_complete*20)
  end

  def update_score!
    score.update_attributes :score => calculate_score,
                            :forges_complete => forges_complete,
                            :total_items => total_items,
                            :advanced_items => advanced_items,
                            :rare_items => rare_items,
                            :epic_items => epic_items
  end

  # Skills

  def skills
    @skills ||= (Skill.where(:player_id => self.id).first || Skill.create(:player_id => self.id))
  end

end
