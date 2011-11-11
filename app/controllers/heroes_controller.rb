class HeroesController < ApplicationController

  def index
    select_nav("battle")
  end

  def update
    @hero = Hero.find(params[:id])
    @loot = Loot.find(params[:loot_id])
    @slot = params[:slot]

    @hero.equip @slot, @loot

    render "loot/show"
  end

end