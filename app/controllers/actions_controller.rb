class ActionsController < ApplicationController

  before_filter :find_battle

  def create
    @action = @battle.actions.build params[:battle_action]

    if @action.save
      render :json => @action
    else
      render :json => @action.errors
    end
    
  end

  #------

  def find_battle
    @battle = Battle.find(params[:battle_id])
  end

end