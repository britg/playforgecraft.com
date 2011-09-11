class ApplicationController < ActionController::Base
  
  protect_from_forgery

  layout :detect_layout

  protected

  def detect_layout
    return nil if request.xhr?
    "application"
  end

  def admin?
    current_user.try(:admin)
  end


end
