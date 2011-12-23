class PlayersController < ApplicationController

  before_filter :require_player!

  def index
    select_nav 'ladder'
  end

  def show
    select_nav("profile")
    @player = Player.find_by_url_name(params[:playername])
    redirect_to(root_path, :notice => t("notices.player_not_found")) and return \
      unless @player.present?
  end

  def edit
    current_player.build_setting unless current_player.setting.present?
  end

  def update
    current_player.create_setting unless current_player.setting.present?
    current_player.setting.update_attributes(params[:player][:setting])
    render :json => current_player
  end

end