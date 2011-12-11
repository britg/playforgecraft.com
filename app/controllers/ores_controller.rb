class OresController < ApplicationController

  before_filter :find_forge

  respond_to :json

  def index
    @set = Ore.random_set(params[:count])
    respond_with @set
  end

  def swap
    purchased = @forge.requires_funding? ? current_player.purchase!(Ore::SWAP_COST) : true
    render :json => { :purchased => purchased, :player => current_player }
  end

  def find_forge
    @forge = Forge.where(:_id => params[:forge_id]).first
  end

end