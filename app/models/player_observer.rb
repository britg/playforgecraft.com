class PlayerObserver < ActiveRecord::Observer

  def after_create player
    Hero.create_heroes_for player
  end

end