desc "Connect to MongoHQ console"

namespace :mongohq do
  task :connect do
    system 'mongo staff.mongohq.com:10064/app929333 -u heroku -p 193170bs'
  end
end