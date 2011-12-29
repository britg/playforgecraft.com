desc "Update the scores"
task :update_scores => :environment do
  puts "Updating scores..."
  Player.update_scores!
  puts "done."
end