class PlayerObserver < ActiveRecord::Observer

  def after_create player
    Hero.create_heroes_for player
    player.start_forge Mine.find(1)
  end

end