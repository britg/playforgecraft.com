class Tile < ActiveRecord::Base

  belongs_to :game
  belongs_to :ore

  validates_presence_of :game
  validates_presence_of :ore

  def to_ore
    Ore.name_cache(ore_id)
  end

  def swap_with other_tile
    myX = self.x
    myY = self.y
    thX = other_tile.x
    thY = other_tile.y

    update_attributes(:x => thX, :y => thY)
    other_tile.update_attributes(:x => myX, :y => myY)
  end
  
end