class CreateTiles < ActiveRecord::Migration
  def change
    create_table :tiles do |t|

      t.references :game

      t.integer :x, :default => 0
      t.integer :y, :default => 0

      t.references :ore

      t.timestamps
    end

    add_index :tiles, :game_id
  end
end
