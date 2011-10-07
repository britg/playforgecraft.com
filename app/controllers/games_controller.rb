
class GamesController < ApplicationController

  layout "game"

  before_filter :require_player!

  def index

  end

  def new
    @game = current_player.active_game || current_player.start_game
    redirect_to game_path(@game)
  end

  def show
    @game = Game.find(params[:id])
    validate_player
  end

  protected

  def validate_player
    unless @game and @game.has_player? current_player
      redirect_to root_path, :notice => t("notices.game_player_required") \
        and return false
    end
  end

end