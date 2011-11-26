class BattlesController < ApplicationController

  before_filter :require_player!, :set_nav

  def index
    @previous_battles = current_player.battles.finished.limit(10)
  end

  def create
    @battle = Battle.new(params[:battle])

    if @battle.save
      render :json => @battle
    else
      render :json => @battle.errors
    end

  end

  def show
    @battle = Battle.where(:_id => params[:id]).first
    redirect_to battles_path and return unless @battle.present?
  end

  def destroy
    @battle = Battle.find(params[:id])
    @battle.forfeit(current_player)
    render :json => { :result => :success }
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