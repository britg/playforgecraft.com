
class UsersController < ApplicationController

  layout 'home'

  def index
    redirect_to player_path(current_player) and return if current_player.present?
    @new_player = Player.new
    render :home
  end

  def home
    @new_player = Player.new
    render :home
  end

end