class Action < ActiveRecord::Base

  SWAP_TILES_ACTION = :swap_tiles
  FORGE_ACTION = :forge

  attr_accessor :payload, :forgeable, :accuracy

  belongs_to :game
  belongs_to :player
  belongs_to :loot

  has_and_belongs_to_many :tiles

  after_create :action_callbacks

  def assign loot
    loot.action = self
    loot.player = player
    loot.game = game
    loot.save
  end

  protected

  def action_callbacks
    @payload = {}
    perform_swap_tiles if self.action.to_sym == Action::SWAP_TILES_ACTION
    perform_forge if self.action.to_sym == Action::FORGE_ACTION
    spend_action
  end

  def perform_swap_tiles
    swapping = tiles.all
    swapping.first.swap_with swapping.second
  end

  def perform_forge
    loot = game.forge forgeable_class, forgeable_ore, forgeable_accuracy, player

    assign(loot) if loot.present?

    @payload[:loot] = loot
    @payload[:tiles] = game.consume tiles
  end

  def spend_action
    @payload[:game] = game.spend_action
  end

end
