
class AdminController < ApplicationController

  before_filter :authenticate_user!, :require_admin

  protected

  def require_admin
    unless current_user.admin?
      redirect_to logout_path and return false
    end
  end

end