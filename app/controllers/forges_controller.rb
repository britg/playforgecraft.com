
class ForgesController < ApplicationController

  before_filter :require_player!, :set_nav

  respond_to :json

  def show
    @forge = Forge.where(:_id => params[:id]).first
    redirect_to enemy_path(@forge.boss) and return if @forge.should_fight_boss?
    redirect_to(player_path(current_player)) and return unless @forge.present?

    @events = @forge.events.reverse.take(20)
    @latest_event = @events.take(1)
  end

  def complete
    @forge = Forge.where(:_id => params[:id]).first
  end

  def update
    @forge = Forge.where(:_id => params[:id]).first
    @forge.restart! if params[:restart] 
    redirect_to forge_path(@forge)
  end

  def set_nav
    select_nav "forge"
  end

end
