
class UsersController < ApplicationController

  def index
    redirect_to player_path(current_player) if current_player.present?
    @new_email = Email.new
  end

  def create
    render :text => params and return
  end

end