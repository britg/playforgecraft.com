class Item < ActiveRecord::Base
  
  belongs_to :genre
  belongs_to :classification
  belongs_to :ore
  belongs_to :rarity
  belongs_to :item_set

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

end
