class MinesController < ApplicationController

  before_filter :set_nav, :set_zones

  def index
    @mines = Mine.all
    render "show"
  end

  def show
    @mines = Mine.all
    @mine = Mine.find(params[:id])
  end

  def update
    @mine = Mine.find(params[:player][:mine_id])
    forge = current_player.start_forge(@mine) if current_player.can_mine_at?(@mine)
    render :json => forge
  end

  def set_nav
    select_nav 'map'
  end

  def set_zones
    @zones = Zone.enabled
  end

end