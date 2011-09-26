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
  before_save :ensure_item_set_rarity

  has_attached_file :icon,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :default_url => lambda { |a| a.instance.classification.default_icon.url },
    :styles => { :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  has_attached_file :art,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :default_url => lambda { |a| a.instance.classification.default_art.url },
    :styles => { :full => ["640x960#", :jpg], :normal => ["320x480#", :jpg], :small => ["160x240#", :jpg] }

  default_scope order("rarity_id asc, name asc")

  Rarity::DEFAULTS.each do |r|
    scope r.downcase.to_sym, joins(:rarity).where("rarities.name = ?", r)
  end

  Classification::DEFAULTS.each do |type, classes|
    classes.each do |c|
      scope c.downcase.to_sym, joins(:classification).where("classifications.name = ?", c)  
    end
  end

  class << self

    def item_count(type, ore)
      Item.where(:classification_id => type.id, :ore_id => ore.id).count
    end

    def armory_dump
      {
        :ores => Ore.all,
        :rarities => Rarity.all,
        :classifications => Classification.all,
        :items => Item.all,
        :item_sets => ItemSet.all
      }
    end

  end

  def to_s
    name
  end

  def icon_url
    icon.url(:thumb)
  end

  def art_url
    art.url(:full)
  end

  def serializable_hash(opts)
    super((opts||{}).merge(:methods => [:icon_url, :art_url]))
  end

  def to_param
    "#{id}-#{name.gsub(/[^a-zA-Z0-9\-]+/, '-')}"
  end

  def type
    "#{rarity.name} #{ore} #{classification.name}"
  end

  def weapon?
    genre.name == 'Weapon'
  end

  def armor?
    genre.name == 'Armor'
  end

  protected

  def default_genre
    self.genre = self.classification.try(:genre)
  end

  def ensure_item_set_rarity
    if self.item_set_id.present?
      self.rarity = Rarity.of(:set)
    elsif self.rarity.set?
      self.rarity = Rarity.of(:advanced)
    end
  end

end
