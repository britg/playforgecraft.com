class ApplicationController < ActionController::Base
  protect_from_forgery

  def awesome
    "awesome"
  end
end
