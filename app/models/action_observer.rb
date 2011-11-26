class ActionObserver < ActiveRecord::Observer

  def before_create action
    perform_attack if action.is_attack?
  end

  def perform_attack
    puts "performing attack"
  end

end
