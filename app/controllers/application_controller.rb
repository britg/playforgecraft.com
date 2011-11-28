class ApplicationController < ActionController::Base
  
  protect_from_forgery

  layout :detect_layout

  helper_method :admin?, :current_user, :current_player,
                :current_zone, :current_mine

  protected

  def current_player
    @current_player ||= current_user.try(:player)
  end

  def current_zone
    @current_zone ||= current_player.try(:zone)
  end

  def current_mine
    @current_mine ||= current_player.try(:mine)
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

  def require_player!
    unless current_player
      redirect_to root_path, :notice => t("notices.player_required") \
        and return false
    end
  end

  def select_nav(item)
    @nav_item = item
  end

end
