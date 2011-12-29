desc "Deploy to heroku"

task :deploy => :environment do
  puts "Deploying"
  system "RAILS_ENV=production bundle exec rake assets:precompile"
  system "git add ."
  system "git commit -am \"precompile before deploy\""
  system "git push"
  system "git push heroku master"
end