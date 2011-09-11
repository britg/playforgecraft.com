source 'http://rubygems.org'

gem 'heroku'
gem 'rails', '3.1.0'
gem 'thin'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'compass', :git => 'https://github.com/chriseppstein/compass.git', :branch => 'rails31'
  gem 'fancy-buttons'
  gem 'sass-rails', "  ~> 3.1.0"
  gem 'coffee-rails', "~> 3.1.0"
  gem 'uglifier'
end

gem 'haml'
gem 'jquery-rails'

group :test do
  # Pretty printed test output
  gem 'turn', :require => false
  gem 'fabrication'
  gem 'shoulda'
  gem 'mocha'
end

group :development do
  gem 'sqlite3'

  # To use debugger
  # gem 'ruby-debug19', :require => 'ruby-debug'

  gem 'foreman'

end

group :production do
  gem 'pg'
end

gem 'devise'
gem 'paperclip'
gem 'aws-s3'
gem 'will_paginate'