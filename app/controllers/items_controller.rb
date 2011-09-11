
class ItemsController < ApplicationController

  before_filter :find_class
  respond_to :html, :js

  def index
    @ore = Ore.find(params[:ore])
    @items = @class.items.where(:ore_id => @ore.to_param)
  end

  def new
    @ore = Ore.find(params[:ore])
    @item = @class.items.build( :name => "#{@ore} #{@class.to_s.singularize}", 
                                :ore_id => @ore.to_param )
  end

  def create
    @item = Item.new(params[:item])
    @item.save

    respond_with @item
  end

  def edit
    @item = Item.find_by_id(params[:id])
  end

  def update
    @item = Item.find_by_id(params[:id])
    @item.update_attributes(params[:item])

    if single = params[:single]
      render :text => params[:item][single] and return
    end

    respond_with @item
  end

  def destroy
    @item = Item.find_by_id(params[:id])
    @item.destroy

    respond_with true
  end

  protected

  def find_class
    @class = Classification.find_by_name(params[:armory_id].try(:singularize))
  end

end