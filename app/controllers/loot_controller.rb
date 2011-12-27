
class LootController < ApplicationController

  before_filter :find_forge

  respond_to :json

  def index
    last = params[:last]
    limit = params[:limit]

    if last
      @loot = @forge.loot.where(["id < ?", last]).limit(limit)
    else
      @loot = @forge.loot.limit(limit)
    end
    
    respond_with @loot
  end

  def create
    @start_time     = Time.now
    @classification = Classification.find_by_name(params[:forging][:classification].capitalize)
    @ore            = Ore.find_by_name(params[:forging][:ore].capitalize)
    
    @accuracy = params[:forging][:accuracy]||Random.new.rand(Forge::DEFAULT_ACCURACY)
    @forge.generate_accuracy_events @accuracy
    
    @loot = Loot.generate(@classification, @ore, @accuracy, current_player, @forge)

    if @loot.save
      @forge.generate_loot_event(@loot)
      @forge.roll_battle!

      @replacements = Ore.random_set(params[:forging][:ore_count])

      set_new_forge_events(@start_time)

      render :json => { :purchased => true, 
                        :loot => @loot,
                        :replacements => @replacements,
                        :player => current_player,
                        :new_events => @new_events,
                        :new_events_html => @new_events_html}
    else
      render :json => { :purchased => false, :player => current_player }
    end

  end

  def show
    @loot = Loot.unscoped.find(params[:id])
  end

  def update
    
  end

  def destroy
    loot = Loot.find(params[:id])
    loot.sell
    render :json => { :player => current_player }
  end

  #-----

  def find_forge
    @forge = Forge.where(:_id => params[:forge_id]).first
  end

end