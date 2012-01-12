class Enemy < ActiveRecord::Base

  validates_presence_of :name
  validates_uniqueness_of :name

  belongs_to :item

  default_scope order("level asc")

  has_attached_file :avatar,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :full => ["200x200#", :jpg], :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  def serializable_hash(opts={})
    super((opts||{}).merge(:only => [:id, :name, :attack, :defense], :methods => [:to_param, :original_defense]))
  end
  
  def to_s
    name
  end

  def original_defense
    defense
  end

  def to_param
    "#{id}-#{name.gsub(/[^a-zA-Z0-9]+/, '-')}"
  end

end
