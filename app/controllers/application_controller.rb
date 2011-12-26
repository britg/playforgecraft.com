class ApplicationController < ActionController::Base
  
  protect_from_forgery

  layout :detect_layout

  before_filter :require_player!, :unless => :open_routes

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
    return "home" if devise_controller?
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

  def update_last_active
    return unless current_player.present?
    current_player.touch(:last_active_at)
  end

  def open_routes
    devise_controller? or \
    params[:controller] == "users"
  end

  def set_new_forge_events time
    @forge.reload
    @new_events = @forge.events_after(time)
    @new_events_html = render_to_string(:partial => "events/list",
                                        :locals => {:events => @new_events})
  end

end
