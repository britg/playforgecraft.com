desc "Deploy to heroku"

namespace :deploy do

  task :default => [:normal]

  task :normal do
    puts "Deploying"
    system "RAILS_ENV=production bundle exec rake assets:precompile && git add . && git commit -am \"precomple\" && git push && git push heroku master && open http://playforgecraft.com"
  end
  
  task :migrations do
    puts "Deploying and Migrating"
    system "RAILS_ENV=production bundle exec rake assets:precompile && git add . && git commit -am \"precomple\" && git push && git push heroku master && heroku run rake db:migrate && heroku restart"
  end

end