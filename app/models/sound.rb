class Sound < ActiveRecord::Base

  has_attached_file :mp3,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:sound_ident/:attachment.:extension"

  has_attached_file :ogg,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:sound_ident/:attachment.:extension"

  has_attached_file :wav,
    :storage => :s3,
    :s3_credentials => "#{Rails.root}/config/s3.yml",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate},
    :path => "/:class/:sound_ident/:attachment.:extension"

  class << self
    
  end

  def serializable_hash(opts)
    super((opts||{}).merge(:only => [:id, :tag], :methods => [:mp3_url, :ogg_url, :wav_url]))
  end

  def mp3_url
    mp3.url
  end

  def ogg_url
    ogg.url
  end

  def wav_url
    wav.url
  end

  def complete?
    mp3.present? and ogg.present? and wav.present?
  end

  def ident
    name.downcase.strip.gsub /\s+/, '_'
  end

end

Paperclip.interpolates :sound_ident do |attachment, style|
  attachment.instance.ident
end
