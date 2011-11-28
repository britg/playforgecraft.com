class Player < ActiveRecord::Base

  belongs_to :user
  belongs_to :zone
  belongs_to :mine

  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false

  has_many :loot, :class_name => "Loot"
  has_many :items, :through => :loot
  has_many :heroes
  has_many :slots, :class_name => "HeroSlot"

  has_attached_file :avatar,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :full => ["200x200#", :jpg], :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  before_create :starting_level

  class << self

    def ladder
      order("level desc")
    end

    def range(range_id)
      "#{(range_id.to_i*10+1)}-#{(range_id.to_i+1)*10}"
    end

  end

  def to_s
    "#{name}"
  end

  def to_param
    name
  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:only => [:id, :name, :level, :coins], :methods => [:zone, :forge]))
  end

  def starting_level
    self.level = 1 unless self.level.present?
  end

  def to_css_class
    'advanced'
  end

  def title
    "Novice Crafstman"
  end

  def rare_count
    @rare_count ||= items.rare.uniq.count
  end

  def rare_percent
    (rare_count.to_f / Item.rare.count.to_f * 100).round rescue 0
  end

  def epic_count
    @epic_count ||= items.epic.uniq.count
  end

  def epic_percent
    @epic_percent ||= (epic_count.to_f / Item.epic.count.to_f * 100).round rescue 0
  end

  def set_count
    0
  end

  def set_percent
    0
  end

  def item_count
    @item_count ||= items.uniq.count
  end

  def item_percent
    @item_percent ||= (item_count.to_f / Item.all.count.to_f * 100).round rescue 0
  end

  def work_order_count
    0
  end

  def work_order_percent
    0
  end

  def mine_count
    0
  end

  def mine_percent
    0
  end

  def purchase!(cost)
    return false if cost > forge.funds
    forge.inc(:funds, -cost)
    true
  end

  def sell!(cost)
    increment!(:coins, cost)
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

  # Mines

  def travel_to target_mine
    self.update_attributes(:mine => target_mine, :zone => target_mine.zone)
    start_forge(target_mine) unless has_forge?(target_mine)
  end

  def can_travel_to? mine
    true
  end

  # Forges

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
    forges.create :mine_id => target_mine.try(:id), :funds => target_mine.starting_funds
  end

  def has_forge? target_mine
    forge_for(target_mine).present?
  end

end
