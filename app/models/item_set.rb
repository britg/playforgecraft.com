class ItemSet < ActiveRecord::Base

  has_many :items

  has_attached_file :icon,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :default_url => "http://forgecraft.s3.amazonaws.com/default.jpg",
    :styles => { :thumb => ["100x100#", :jpg], :tiny => ["50x50#", :jpg] }

  has_attached_file :art,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :default_url => "http://forgecraft.s3.amazonaws.com/default.jpg",
    :styles => { :full => ["640x960#", :jpg], :normal => ["320x480#", :jpg], :small => ["160x240#", :jpg] }

  def icon_url
    icon.url(:thumb)
  end

  def art_url
    art.url(:full)
  end

  def serializable_hash(opts)
    super((opts||{}).merge(:methods => [:icon_url, :art_url]))
  end

end
