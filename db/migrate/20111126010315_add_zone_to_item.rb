class AddZoneToItem < ActiveRecord::Migration
  def change
    add_column :items, :zone_id, :integer
    add_index :items, :zone_id
    add_column :players, :zone_id, :integer
    add_index :players, :zone_id
  end
end
