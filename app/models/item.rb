class Item < ActiveRecord::Base

  MIN_ATTACK = 10
  MIN_DEFENSE = 20
  
  belongs_to :genre
  belongs_to :classification
  belongs_to :ore
  belongs_to :rarity
  belongs_to :item_set
  belongs_to :zone

  has_many :loot, :class_name => "Loot"

  validates_presence_of :name
  validates_presence_of :genre
  validates_presence_of :classification
  validates_presence_of :ore
  validates_presence_of :rarity

  before_validation :default_genre
  after_destroy :remove_loot

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

  default_scope order("rarity_id desc, name asc")

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
      Item.of_class(type).of_ore(ore).count
    end

    def of_zone(zone)
      where(:zone_id => zone)
    end

    def of_ore(ore)
      where(:ore_id => ore)
    end

    def of_class(classification)
      where(:classification_id => classification)
    end

    def of_rarity(rarity)
      where(:rarity_id => rarity)     
    end

    def in_range(range)
      min = range.to_i * 10 + 1
      max = min + 9
      min = 0 if min < 10
      where(["level between ? and ?", min, max])
    end

    def armory_dump
      {
        :version => Version.last.try(:id)||0,
        :ores => Ore.all,
        :rarities => Rarity.all,
        :classifications => Classification.all,
        :items => Item.all,
        :item_sets => ItemSet.all
      }
    end

    def seed zone
      Ore.all.each do |ore|
        Rarity.defaults.each do |rarity|
          Classification.all.each do |classification|
            
            item = Item.where(  :ore_id => ore.id, 
                                :rarity_id => rarity.id, 
                                :zone_id => zone.id, 
                                :classification_id => classification.id ).first
            
            unless item.present?
              item = Item.new(  :ore_id => ore.id, 
                                :rarity_id => rarity.id, 
                                :zone_id => zone.id, 
                                :classification_id => classification.id, 
                                :name => "#{rarity.to_s.capitalize} #{ore.to_s.capitalize} #{classification.to_s.singularize}", 
                                :genre_id => classification.genre_id)
            end
            
            if item.weapon?
              item.attack_min = MIN_ATTACK + item.rating*1.8
              item.attack_max = MIN_ATTACK + item.rating*3.6
            else
              item.defense_min = MIN_DEFENSE + item.rating*2.2
              item.defense_max = MIN_DEFENSE + item.rating*4.0
            end
            item.save
          end
        end
      end
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
    super((opts||{}).merge(:methods => [:icon_url, :art_url, :cost!]))
  end

  def to_param
    "#{id}-#{name.gsub(/[^a-zA-Z0-9\-]+/, '-')}"
  end

  def to_css_classes
    type.downcase
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

  def rating
    (((rarity.rank+1)*2)*((ore.rank+1))*classification.id)
  end

  def cost!
    cost||default_cost
  end

  def default_cost
    ore.cost + classification.cost
  end

  def remove_loot
    Loot.unscoped.where(:item_id => self.id).delete_all
  end

  protected

  def default_genre
    self.genre = self.classification.try(:genre)
  end

end
