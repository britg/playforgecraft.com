
class ForgesController < ApplicationController

  before_filter :require_player!

  respond_to :json

  def show
    select_nav("forge")
    @loot = current_player.loot.limit(20)
  end

  def create

    classification = Classification.find_by_name(params[:forging][:classification].capitalize)
    ore = Ore.find_by_name(params[:forging][:ore].capitalize)
    accuracy = params[:forging][:accuracy]

    loot = Loot.generate(classification, ore, accuracy, current_player)
    replacements = Ore.random_set(params[:forging][:ore_count])

    if loot.save
      render :json => { :purchased => true, :loot => loot, :replacements => replacements, :player => current_player }
    else
      render :json => { :purchased => false, :player => current_player }
    end

  end

end
