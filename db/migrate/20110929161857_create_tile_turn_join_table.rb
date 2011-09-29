class CreateTileTurnJoinTable < ActiveRecord::Migration
  def change
    create_table :tiles_turns, :id => false do |t|
      t.integer :tile_id
      t.integer :turn_id
    end

    add_index :tiles_turns, :tile_id
    add_index :tiles_turns, :turn_id
    add_index :tiles_turns, [:tile_id, :turn_id], :unique => true
  end
end
