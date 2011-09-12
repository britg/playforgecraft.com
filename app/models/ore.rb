class Ore < ActiveRecord::Base

  DEFAULTS = ["Stone", "Bronze", "Iron", "Dark Iron", "Gold", "Mithril"]

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

  end

  def to_s
    name
  end

  def to_asset
    name.downcase.gsub(/\s/, '')
  end
  
end
