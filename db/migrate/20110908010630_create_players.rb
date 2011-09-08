class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|

      t.references :user

      t.string :name
      t.integer :level
      t.integer :experience

      t.timestamps
    end

    add_index :players, :user_id, :unique => true
    add_index :players, :name, :unique => true
  end
end
