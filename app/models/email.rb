class Email < ActiveRecord::Base

  validates_presence_of :address
  validates_uniqueness_of :address

  def to_s
    address
  end
  
end
