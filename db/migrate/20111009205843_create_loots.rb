class CreateLoots < ActiveRecord::Migration
  def change
    create_table :loots do |t|

      t.references :player
      t.references :game
      t.references :action
      t.references :item

      t.integer :attack
      t.integer :defense

      t.timestamps
    end

    add_index :loots, :player_id
    add_index :loots, :game_id
    add_index :loots, :action_id, :unique => true
    add_index :loots, :item_id
  end
end
