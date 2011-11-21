class BattlesController < ApplicationController

  before_filter :require_player!, :set_nav

  def index
      
  end

  def create
    @battle = Battle.new(params[:battle])

    if @battle.save
      redirect_to battle_path(@battle)
    else
      render :json => @battle.errors
    end

  end

  def show
    @battle = Battle.find(params[:id])
    redirect_to battles_path and return unless @battle.present?
  end

  #-----

  def create_singleplayer_battle
    @battle = Battle.singleplayer_for current_player
    redirect_to battle_path(@battle) and return false
  end

  def set_nav
    select_nav('battle')
  end

end