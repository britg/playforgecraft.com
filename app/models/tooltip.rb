class Tooltip < ActiveRecord::Base

  default_scope order("page asc")

  has_attached_file :image,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:id/:attachment/:style.:extension",
    :styles => { :thumbnail => ["200x200#", :png] }

  def to_s
    title
  end

  def has_image?
    image.present?
  end

end
