
class UsersController < ApplicationController

  def index
    @new_email = Email.new
  end

  def create
    render :text => params and return
  end

end