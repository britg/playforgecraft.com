class Tile < ActiveRecord::Base

  belongs_to :game
  belongs_to :ore

  validates_presence_of :game
  validates_presence_of :ore

  def to_ore
    ore.to_s.parameterize
  end
  
end