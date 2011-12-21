class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|

      t.references :player

      t.boolean :effects, :default => true
      t.boolean :music, :default => true

      t.timestamps

    end

    add_index :settings, :player_id, :unique => true
  end
end
