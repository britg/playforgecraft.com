desc "Deploy to heroku"

task :deploy => :environment do
  puts "Deploying"
  system "RAILS_ENV=production bundle exec rake assets:precompile && git add . && git commit -am \"precomple\" && git push && git push heroku master && open http://playforgecraft.com"
  # system "git add ."
  # system "git commit -am \"precompile before deploy\""
  # system "git push"
  # system "git push heroku master"
end