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

  def commit
    process_actions if params[:actions].present?
    render :json => @battle.processed_actions
  end

  #------

  def find_battle
    @battle = Battle.find(params[:battle_id])
  end

  def process_actions
    params[:actions].each do |i, action_data|
      @battle.process_action current_player, action_data
    end
  end

end