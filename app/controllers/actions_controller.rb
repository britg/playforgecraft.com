class ActionsController < ApplicationController

  before_filter :find_game

  respond_to :json

  def create
    @action = @game.actions.build(params[:game_action])
    @action.player = current_player

    if @action.save
      render :json => { :status => "success", :payload => @action.payload }
    else
      render :json => { :status => "errors", :errors => @action.errors }
    end

  end

  protected

  def find_game
    @game = Game.find_by_id(params[:game_id])
    validate_player
  end

  def validate_player
    not_authorized_response \
      and return false unless @game and @game.has_player? current_player
  end

end