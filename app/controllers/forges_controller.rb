
class ForgesController < ApplicationController

  before_filter :require_player!, :set_nav

  respond_to :json

  def show
    @forge = Forge.find(params[:id]) rescue redirect_to(player_path(current_player)) and return
    @loot = @forge.loot.limit(20)
  end

  def set_nav
    select_nav "forge"
  end

end
