
class ForgesController < ApplicationController

  before_filter :require_player!

  layout "forge"

  def show
  end

end
