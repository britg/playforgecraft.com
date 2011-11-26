class ZonesController < ApplicationController

  def index
    select_nav 'map'    
  end

  def update
    zone = Zone.find(params[:player][:zone_id])
    current_player.travel_to(zone) if current_player.can_travel_to?(zone)
    render :json => current_player
  end

end