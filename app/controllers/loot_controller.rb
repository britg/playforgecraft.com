
class LootController < ApplicationController

  respond_to :json

  def index
    @forge = Forge.find(params[:forge_id])
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

    classification = Classification.find_by_name(params[:forging][:classification].capitalize)
    ore = Ore.find_by_name(params[:forging][:ore].capitalize)
    accuracy = params[:forging][:accuracy]

    loot = Loot.generate(classification, ore, accuracy, current_player)
    replacements = Ore.random_set(params[:forging][:ore_count])

    if loot.save
      loot.generate_battle if Loot.random_battle?
      render :json => { :purchased => true, :loot => loot, :replacements => replacements, :player => current_player }
    else
      render :json => { :purchased => false, :player => current_player }
    end

  end

  def show
    @loot = Loot.find(params[:id])
  end

  def update
    
  end

  def destroy
    loot = Loot.find(params[:id])
    loot.sell
    render :json => { :player => current_player }
  end

end