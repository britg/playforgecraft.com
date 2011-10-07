class Action < ActiveRecord::Base

  SWAP_TILES_ACTION = :swap_tiles
  FORGE_ACTION = :forge

  belongs_to :game
  belongs_to :player
  belongs_to :loot

  has_and_belongs_to_many :tiles

  after_create :action_callbacks

  protected

  def action_callbacks
    perform_swap_tiles if self.action.to_sym == Action::SWAP_TILES_ACTION
    perform_forge if self.action.to_sym == Action::FORGE_ACTION
  end

  def perform_swap_tiles
    swapping = tiles.all
    swapping.first.swap_with swapping.second
  end

  def perform_forge
    
  end

end
