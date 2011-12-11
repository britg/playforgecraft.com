class AddOptionsToMines < ActiveRecord::Migration
  def change
    add_column :mines, :requires_funding, :boolean, :default => true
    add_column :mines, :max_rarity_id, :integer
    add_column :mines, :item_id, :boolean
    add_column :mines, :battle_chance, :integer
  end
end
