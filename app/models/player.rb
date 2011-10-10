class Player < ActiveRecord::Base

  belongs_to :user

  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false

  has_many :games, :foreign_key => :challenger_id

  has_attached_file :avatar,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :full => ["200x200#", :jpg], :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  before_create :starting_level

  def to_s
    "#{name} (#{level})"
  end

  def active_game
    games.last
  end

  def start_game
    new_game = games.create
    new_game.reset!
    new_game
  end

  def starting_level
    self.level = 1 unless self.level.present?
  end

end
