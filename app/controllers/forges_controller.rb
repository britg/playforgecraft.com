
class ForgesController < ApplicationController

  before_filter :require_player!, :set_nav

  respond_to :json

  def show
    @forge = Forge.where(:_id => params[:id]).first
    @events = @forge.events.reverse.take(20)
    @latest_event = @events.take(1)
    redirect_to(player_path(current_player)) and return unless @forge.present?
    @loot = @forge.loot.limit(20)
    current_player.update_attributes(:mine_id => @forge.mine_id)
  end

  def set_nav
    select_nav "forge"
  end

end
