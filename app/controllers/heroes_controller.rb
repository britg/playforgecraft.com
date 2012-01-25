class HeroesController < ApplicationController

  def index
    select_nav("battle")
  end

  def update
    @hero = Hero.find(params[:id])
    @loot_to_equip = Loot.find(params[:loot_id])
    @slot = params[:slot]

    @hero.equip @slot, @loot_to_equip

    @loot = current_player.loot.best(@loot_to_equip.item) || @loot_to_equip
    render "loot/show"
  end

end