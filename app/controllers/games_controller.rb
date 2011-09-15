
class GamesController < ApplicationController

  def new
    @game = Game.new
    @game.init_tiles
  end

end