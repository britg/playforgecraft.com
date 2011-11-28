class Mine < ActiveRecord::Base

  belongs_to :zone
  has_many :players

  def to_param
    "#{id}-#{name.gsub(/[^a-zA-Z0-9]+/, '-')}"
  end

  def to_s
    name
  end
  
end
