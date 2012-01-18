class PlayerObserver < ActiveRecord::Observer

  def after_create player
    Hero.create_heroes_for player
    player.start_forge Mine.find(1)
    player.create_setting
    player.update_score!
    player.skills.inc(:available_points, 5)
  end

end