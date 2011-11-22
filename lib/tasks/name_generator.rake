desc "Generate a name"

namespace :name_generator do
  task :generate do
    require 'name_generator/name_generator'
    puts NameGenerator.create
  end
end