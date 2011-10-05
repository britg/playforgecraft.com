class CreateActions < ActiveRecord::Migration
  def change
    create_table :actions do |t|

      t.references :game
      t.references :player
      t.references :loot

      t.integer :turn
      t.string :action

      t.timestamps

    end

    add_index :actions, :game_id
    add_index :actions, [:game_id, :turn], :unique => true
    add_index :actions, :player_id
    
  end
end
