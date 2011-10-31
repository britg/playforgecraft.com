class PlayersController < ApplicationController

  def show
    @player = Player.find_by_name(params[:playername])
  end

end