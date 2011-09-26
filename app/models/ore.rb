class Ore < ActiveRecord::Base

  default_scope order("rank asc")

  DEFAULTS = ["Stone", "Bronze", "Iron", "Gold", "Mithril", "Dragonsteel"]
  UNIT = 100.0/21.0
  CHANCES = [6.0*UNIT, 5.0*UNIT, 4.0*UNIT, 3.0*UNIT, 2.0*UNIT, 1.0*UNIT]

  has_many :items

  validates_presence_of :name, :rank

  has_attached_file :tile,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :large => ["128x128#", :png], :normal => ["64x64#", :png], :small => ["32x32#", :png] }

  # Class Methods
  class << self
    
    def to_select_options
      all.map{ |o| [o.name, o.id] }
    end

    def random
      roll = Random.new.rand(100)
      sum = 0.0
      i = 0

      CHANCES.each do |ch|
        sum += ch
        break if (roll <= sum)
        i += 1
      end

      where(:rank => i).first
    end

  end

  def to_s
    name
  end

  def tile_url
    tile.url(:large)
  end

  def serializable_hash(opts)
    super((opts||{}).merge(:methods => [:tile_url]))
  end

  def to_asset
    name.downcase.gsub(/\s/, '')
  end
  
end
