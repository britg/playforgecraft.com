
class ClassificationsController < ApplicationController

  def index
    select_nav("armory")
  end

  def show
    @classification = Classification.find_by_name(params[:id].singularize)
  end
  
end