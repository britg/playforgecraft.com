class EnemiesController < ApplicationController

  def show
    @enemy = Enemy.find(params[:id])
    @seed = ["warrior", "thief", "ranger"].sort_by{ rand }
  end

  def update
    @enemy = Enemy.find(params[:id])
    @forge = current_player.forges.where(:level => @enemy.level).first
    @forge.defeat_boss() if params[:winner] == 'player'
    render :json => @forge
  end

end