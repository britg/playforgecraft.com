class AddAvailableToLoot < ActiveRecord::Migration
  def change
    add_column :loots, :available, :boolean, :default => true
  end
end
