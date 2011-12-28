class EventsController < ApplicationController

  before_filter :find_forge

  def index
  
  end

  def create
    @forge.generate_training_event
    
    respond_to do |format|
      format.html{ redirect_to forge_path(@forge) and return }
    end  
  end


  protected

  def find_forge
    @forge = Forge.where(:_id => params[:forge_id]).first  
  end

end