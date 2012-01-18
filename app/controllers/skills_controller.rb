class SkillsController < ApplicationController

  def update
    current_player.skills.increase(params[:skill])
    respond_to do |format|
      format.json{ render :json => current_player }
    end
  end

end