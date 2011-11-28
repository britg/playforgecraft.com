class AddForgeIdToLoot < ActiveRecord::Migration
  def change
    add_column :loots, :forge_id, :string
    add_index :loots, :forge_id
  end
end
