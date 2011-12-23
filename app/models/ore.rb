class Ore < ActiveRecord::Base

  default_scope order("rank asc")

  DEFAULTS = ["Bone", "Bronze", "Iron", "Eldarite", "Mithril", "Dragonsteel"]
  UNIT = 100.0/21.0
  CHANCES = [6.0*UNIT, 5.0*UNIT, 4.0*UNIT, 3.0*UNIT, 2.0*UNIT, 1.0*UNIT]

  SWAP_COST = 0

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

    def find ident
      find_by_id(ident) || find_by_name(ident.singularize)
    end
    
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

      rank_cache(i)
    end

    def random_set(count)
      set = []
      count.to_i.times do
        set << random
      end
      set
    end

    def browsable
      Ore.where(:name => DEFAULTS)
    end

    def rank_cache(rank)
      @rank_cache ||= {}
      @rank_cache[rank] ||= find_by_rank(rank)
    end

    def tile_cache(id)
      @tile_cache ||= {}
      @tile_cache[id] ||= Ore.find(id).tile rescue Ore.new.tile
    end

    def name_cache(id)
      @name_cache ||= {}
      @name_cache[id] ||= Ore.find(id).to_class rescue ""
    end

    def tile_urls
      mapping = {}
      Ore.all.each do |ore|
        mapping[ore.rank] = ore.tile_url
      end
      mapping
    end

    def dragonsteel
      Ore.find_by_name("Dragonsteel")
    end

    def defaults
      Ore.where(:name => DEFAULTS)
    end

  end

  def to_param
    name
  end

  def to_s
    name
  end

  def to_class
    to_s.parameterize
  end

  def tile_url
    tile.url(:normal)
  end

  def serializable_hash(opts)
    super((opts||{}).merge(:methods => [:to_class], :only => [:name, :rank]))
  end

  def to_asset
    name.downcase.gsub(/\s/, '')
  end
  
end
