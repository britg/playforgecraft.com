
class EmailsController < ApplicationController

  def create
    @email = Email.create(params[:email])
    redirect_to root_url, :notice => t('notices.email_thanks')
  end

end