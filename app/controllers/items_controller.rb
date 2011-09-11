
class ItemsController < ApplicationController

  before_filter :find_class

  def index
    @ore = Ore.find(params[:ore])
    @items = @class.items.where(:ore => @ore)
  end

  protected

  def find_class
    @class = Classification.find_by_name(params[:armory_id].singularize)
  end

end