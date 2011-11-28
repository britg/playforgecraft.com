class CreateMines < ActiveRecord::Migration
  def change
    create_table :mines do |t|

      t.references :zone
      
      t.string :name
      t.string :description
      t.text :story

      t.timestamps

    end

    add_index :mines, :zone_id

    add_column :players, :mine_id, :integer
    add_index :players, :mine_id

    add_column :loots, :mine_id, :integer
    add_index :loots, :mine_id
    
  end
end
