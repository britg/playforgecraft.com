class Item < ActiveRecord::Base
  
  belongs_to :genre
  belongs_to :classification
  belongs_to :ore
  belongs_to :rarity
  belongs_to :item_set

  validates_presence_of :name
  validates_presence_of :genre
  validates_presence_of :classification
  validates_presence_of :ore
  validates_presence_of :rarity

  before_validation :default_genre

  has_attached_file :icon,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  has_attached_file :art,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :full => ["640x960#", :jpg], :normal => ["320x480#", :jpg], :small => ["160x240#", :jpg] }

  default_scope order("rarity_id asc, name asc")

  Rarity::DEFAULTS.each do |r|
    scope r.downcase.to_sym, joins(:rarity).where("rarities.name = ?", r)
  end

  def to_s
    name
  end

  def to_param
    "#{id}-#{name.gsub(/[^a-zA-Z0-9\-]+/, '-')}"
  end

  def default_genre
    self.genre = self.classification.try(:genre)
  end

  def weapon?
    genre.name == 'Weapon'
  end

  def armor?
    genre.name == 'Armor'
  end

end
