class CreateActionTurnJoinTable < ActiveRecord::Migration
  def change
    create_table :actions_tiles, :id => false do |t|
      t.integer :action_id
      t.integer :tile_id
    end

    add_index :actions_tiles, :tile_id
    add_index :actions_tiles, :action_id
    add_index :actions_tiles, [:tile_id, :action_id], :unique => true
  end
end
