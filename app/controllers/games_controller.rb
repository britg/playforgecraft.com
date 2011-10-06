
class GamesController < ApplicationController

  layout "game"

  def new
    @game = Game.first || Game.create
  end

end