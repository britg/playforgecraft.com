class AddOptionsToEnemies < ActiveRecord::Migration
  def change
    add_column :enemies, :yields_loot, :boolean, :default => true
    add_column :enemies, :training, :boolean, :default => false
    add_column :enemies, :item_id, :integer
  end
end
