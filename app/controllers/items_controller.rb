
class ItemsController < ApplicationController

  before_filter :find_class

  def index
    @items = @class.items
  end

  protected

  def find_class
    @class = Classification.find_by_name(params[:armory_id].singularize)
  end

end