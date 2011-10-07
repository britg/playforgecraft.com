class ApplicationController < ActionController::Base
  
  protect_from_forgery

  layout :detect_layout

  helper_method :admin?

  protected

  def current_player
    current_user.try(:player)
  end

  def not_authorized_response
    render :json => { :status => "error", :error => "not authorized" }
  end

  def detect_layout
    return nil if request.xhr?
    "application"
  end

  def admin?
    current_user and current_user.admin?
  end

  def require_admin!
    unless current_user and current_user.admin?
      redirect_to logout_path and return false
    end
  end


end
