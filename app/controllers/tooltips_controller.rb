class TooltipsController < ApplicationController

  def index

    @tooltips = Tooltip.all
    
  end

  def show
    @tooltip = Tooltip.find(params[:id])
  end
  
end