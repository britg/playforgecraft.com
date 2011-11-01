class OresController < ApplicationController

  respond_to :json

  def index
    @set = Ore.random_set(params[:count])
    respond_with @set
  end

  def swap
    current_player.decrement!(:coins, Ore::SWAP_COST)
    render :json => current_player
  end

end