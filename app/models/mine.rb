class Mine < ActiveRecord::Base

  belongs_to :zone
  has_many :players
  
end
