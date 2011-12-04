class PlayersController < ApplicationController

  def index
    select_nav 'ladder'
  end

  def show
    select_nav("profile")
    @player = Player.find_by_name(params[:playername])
    redirect_to(root_path, :notice => t("notices.player_not_found")) and return \
      unless @player.present?
  end

  def edit
    
  end

end