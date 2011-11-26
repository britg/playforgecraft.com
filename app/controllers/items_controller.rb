
class ItemsController < ApplicationController

  before_filter :armory_nav
  respond_to :html, :js

  def index
    @items = parse_filters

    if params[:filter].present?
      render(:partial => "items/table", :locals => {:items => @items, :context => @context}) and return
    end
  end

  def show
    select_nav('armory')
    @item = Item.find(params[:id])
  end

  def new
    @item = Item.new( :name => "Item Name" )
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
      render :text => @item[single] and return
    end

    respond_with @item
  end

  def destroy
    require_admin!
    @item = Item.find_by_id(params[:id])
    @item.destroy

    respond_with true
  end

  protected

  def armory_nav
    select_nav('armory')
  end

  def parse_filters

    @context_arr = []

    # parse_level
    parse_zone
    parse_class
    parse_ores
    parse_rarity
    
    @filtered = Item.of_class(params[:classification]) \
                .of_zone(params[:zone_id])
                .of_ore(params[:ores])
                .of_rarity(params[:rarities])

    @context = @context_arr.join(' ')
    @filtered

  end

  def parse_zone
    params[:zone_id] = (current_player.zone.try(:id)||Zone.first.try(:id)) unless params[:zone_id].present?
    zone = Zone.find_by_id(params[:zone_id])
    @context_arr << zone.name
  end

  def parse_level
    params[:level_range] = current_player.level_range unless params[:level_range].present?
    @context_arr << "Level #{Player.range(params[:level_range])}"
  end

  def parse_class
    params[:classification] = 1 unless params[:classification].present?
    @context_arr << "#{Classification.find_by_id(params[:classification])}"
  end

  def parse_ores
    params[:ores] = [1, 2, 3, 4, 5, 6] unless params[:ores].present?
  end

  def parse_rarity
    params[:rarities] = [1, 2, 3, 4, 5] unless params[:rarities].present?
  end

end