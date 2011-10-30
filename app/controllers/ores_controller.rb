class OresController < ApplicationController

  respond_to :json

  def index
    @set = Ore.random_set(params[:count])
    respond_with @set
  end

end