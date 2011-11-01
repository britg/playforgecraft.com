class OresController < ApplicationController

  respond_to :json

  def index
    @set = Ore.random_set(params[:count])
    respond_with @set
  end

  def swap
    purchased = current_player.purchase!(Ore::SWAP_COST)
    render :json => { :purchased => purchased, :player => current_player }
  end

end