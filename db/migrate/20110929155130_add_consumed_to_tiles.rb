class AddConsumedToTiles < ActiveRecord::Migration
  def change
    add_column :tiles, :consumed, :boolean, :default => false
  end
end
