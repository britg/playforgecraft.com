class Classification < ActiveRecord::Base

  belongs_to :genre
  has_many :items

end
