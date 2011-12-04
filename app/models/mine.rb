class Mine < ActiveRecord::Base

  belongs_to :zone
  has_many :players
  has_many :requirements

  accepts_nested_attributes_for :requirements

  def to_param
    "#{id}-#{name.gsub(/[^a-zA-Z0-9]+/, '-')}"
  end

  def to_s
    name
  end
  
end
