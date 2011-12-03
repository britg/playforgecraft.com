class Requirement < ActiveRecord::Base

  belongs_to :mine

  belongs_to :genre
  belongs_to :classification
  belongs_to :ore
  belongs_to :rarity

  def to_s
    [quantity, rarity, ore, classification, genre].compact.join(' ')
  end

end
