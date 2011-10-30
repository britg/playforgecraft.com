
class ForgesController < ApplicationController

  before_filter :require_player!

  respond_to :json

  def show
    @loot = current_player.loot.limit(10)
  end

  def create

    classification = Classification.find_by_name(params[:forging][:classification].capitalize)
    ore = Ore.find_by_name(params[:forging][:ore].capitalize)
    accuracy = params[:forging][:accuracy]

    loot = Loot.generate(classification, ore, accuracy, current_player)

    if loot.save
      render :json => loot
    else
      render :json => loot.errors
    end

    

  end

end
