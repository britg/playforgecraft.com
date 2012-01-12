class EnemiesController < ApplicationController

  def show
    @enemy = Enemy.find(params[:id])
    @seed = ["warrior", "thief", "ranger"].sort_by{ rand }
  end

  def update
    @forge = current_player.forge
    @forge.defeatBoss() if params[:winner] == 'player'
    render :json => @forge
  end

end