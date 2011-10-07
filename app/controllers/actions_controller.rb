class ActionsController < ApplicationController

  before_filter :find_game

  respond_to :json

  def create
    @action = Action.new(params[:action])
    if @action.save
      respond_with @action
    else
      respond_with @action.errors
    end
  end

  protected

  def find_game
    @game = Game.find_by_id(params[:game_id])
    validate_player
  end

  def validate_player
    not_authorized_response \
      and return false unless @game.has_player? current_player
  end

end