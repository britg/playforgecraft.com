class CreateTurns < ActiveRecord::Migration
  def change
    
    create_table :turns do |t|

      t.references :game
      t.references :player
      t.references :loot
      
      t.integer :number
      t.string :action

      t.timestamps

    end

    add_index :turns, :game_id
    add_index :turns, [:game_id, :number], :unique => true
    add_index :turns, :player_id

  end
end
