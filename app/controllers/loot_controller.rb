
class LootController < ApplicationController

  respond_to :json

  def index
    last = params[:last]
    limit = params[:limit]

    if last
      @loot = current_player.loot.where(["id < ?", last]).limit(limit)
    else
      @loot = current_player.loot.limit(limit)
    end
    
    respond_with @loot
  end

  def show
    @loot = Loot.find(params[:id])
  end

  def destroy
    loot = Loot.find(params[:id])
    loot.sell
    render :json => { :player => current_player }
  end

end