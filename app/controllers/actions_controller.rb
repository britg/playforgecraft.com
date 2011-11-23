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
    new_actions = []
    if params[:actions].present?
      params[:actions].each do |i, action_data|
        action_data.merge!({"player_id" => current_player.id, "player_type" => 'player'})

        puts action_data.inspect
        action = @battle.actions.build action_data
        action.save
        new_actions << action
      end
    end
    render :json => new_actions
  end

  #------

  def find_battle
    @battle = Battle.find(params[:battle_id])
  end

end