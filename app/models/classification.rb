class Classification < ActiveRecord::Base

  DEFAULTS = { :weapon => ["Sword", "Axe", "Crossbow"],
               :armor => ["Shield", "Legging", "Tunic"] }

  belongs_to :genre
  has_many :items

  validates_presence_of :name, :genre

  has_attached_file :default_icon,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  has_attached_file :default_art,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :full => ["640x960#", :jpg], :normal => ["320x480#", :jpg], :small => ["160x240#", :jpg] }

  # Class Methods
  class << self

    def find ident
      find_by_id(ident) || find_by_name(ident.singularize)
    end
    
    def to_select_options
      all.map{ |c| [c.name, c.id] }
    end

  end

  def to_s
    name.pluralize
  end

  def to_param
    name.pluralize
  end

  def weapon?
    genre.name == 'Weapon'
  end

  def armor?
    genre.name == 'Armor'
  end
  

end
