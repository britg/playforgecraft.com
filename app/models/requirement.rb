class Requirement < ActiveRecord::Base

  belongs_to :mine

  belongs_to :genre
  belongs_to :classification
  belongs_to :ore
  belongs_to :rarity

  validates_presence_of :quantity

  def to_s
    [quantity, description].compact.join(' ')
  end

  def description_fields
    [rarity, ore, classification, genre].compact
  end

  def description
    out = ""
    out = description_fields.join(' ')

    unless classification or genre
      out += " Items"
    end

    return out.titleize
  end

end