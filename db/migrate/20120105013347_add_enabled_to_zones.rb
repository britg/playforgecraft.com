class AddEnabledToZones < ActiveRecord::Migration
  def change
    add_column :zones, :enabled, :boolean, :default => false
  end
end
