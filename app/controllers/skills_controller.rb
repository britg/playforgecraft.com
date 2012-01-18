class SkillsController < ApplicationController

  def show
    partial = (params[:type] == 'unspent' ? "players/skill_up" : "players/personalization")
    render :partial => partial, :layout => false, :locals => { :player => current_player }
  end

  def update
    current_player.skills.increase(params[:skill])
    respond_to do |format|
      format.json{ render :json => current_player }
    end
  end

end