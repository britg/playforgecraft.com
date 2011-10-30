class Player < ActiveRecord::Base

  belongs_to :user

  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false

  has_many :games, :foreign_key => :challenger_id
  has_many :loot, :class_name => "Loot"
  has_many :items, :through => :loot

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
  end

  def to_s
    "#{name} (#{level})"
  end

  def to_param
    name
  end

  def serializable_hash(opts)
    super((opts||{}).merge(:only => [:name, :level, :coins]))
  end

  def active_game
    continue = games.in_progress.last
  end

  def start_game
    new_game = games.create( :game_type => :singleplayer )
    new_game.reset!
    new_game
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

  def score
    0
  end

end
