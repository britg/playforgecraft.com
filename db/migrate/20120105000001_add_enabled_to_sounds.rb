class AddEnabledToSounds < ActiveRecord::Migration
  def change
    add_column :sounds, :enabled, :boolean, :default => true
  end
end
