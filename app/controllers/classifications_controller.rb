
class ClassificationsController < ApplicationController

  def index
    
    respond_to do |format|
      format.html
      format.json{ render :json => Item.armory_dump }
    end
    
  end

  def show
    @classification = Classification.find_by_name(params[:id].singularize)
  end
  
end