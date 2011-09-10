
class UsersController < ApplicationController

  def index
    @new_email = Email.new
  end

end