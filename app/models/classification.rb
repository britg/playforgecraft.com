class Classification < ActiveRecord::Base

  DEFAULTS = { :weapon => ["Sword", "Axe", "Crossbow"],
               :armor => ["Shield", "Legging", "Tunic"] }

  default_scope order("id asc")

  belongs_to :genre
  has_many :items

  validates_presence_of :name, :genre

  has_attached_file :default_icon,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :default_url => "http://forgecraft.s3.amazonaws.com/default.jpg",
    :styles => { :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  has_attached_file :default_art,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :default_url => "http://forgecraft.s3.amazonaws.com/default.jpg",
    :styles => { :full => ["640x960#", :jpg], :normal => ["320x480#", :jpg], :small => ["160x240#", :jpg] }

  # Class Methods
  class << self

    def find ident
      find_by_id(ident) || find_by_name(ident.singularize)
    end
    
    def to_select_options
      all.map{ |c| [c.name, c.id] }
    end

    def item_count(sym)
      c = sym.to_s.downcase.capitalize.singularize
      Classification.find_by_name(c).items.count rescue 0;
    end

    def sword
      @sword = Classification.find_by_name("Sword")
    end

    def axe
      @axe = Classification.find_by_name("Axe")
    end

    def crossbow
      @crossbow = Classification.find_by_name("Crossbow")
    end

    def shield
      @shield = Classification.find_by_name("Shield")
    end

    def leggings
      @leggings = Classification.find_by_name("Legging")
    end
    
    def tunic
      @tunic = Classification.find_by_name("Tunic")
    end

    def random
      c = count
      offset(rand(c)).first
    end

  end

  def to_s
    name.pluralize
  end

  def to_param
    name.pluralize
  end

  def default_icon_url
    default_icon.url(:thumb)
  end

  def default_art_url
    default_art.url(:full)
  end

  def serializable_hash(opts)
    super((opts||{}).merge(:methods => [:default_icon_url, :default_art_url]))
  end

  def weapon?
    genre.name == 'Weapon'
  end

  def armor?
    genre.name == 'Armor'
  end
  

end
