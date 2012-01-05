class EnemiesController < ApplicationController

  def show
    @enemy = Enemy.find(params[:id])
    @seed = ["warrior", "thief", "ranger"].sort_by{ rand }
  end

  def update
    # Win/Loss events
  end

end