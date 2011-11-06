class CreateHeroes < ActiveRecord::Migration
  def change
    
    create_table :hero_classes do |t|
      t.string :name
      t.timestamps
    end
    
    create_table :heroes do |t|
      t.references :player
      t.references :hero_class
      t.string :name

      t.timestamps
    end

    add_index :heroes, :player_id

    create_table :hero_slots do |t|
      t.references :hero
      t.references :player
      t.references :loot
      t.string :slot

      t.timestamps
    end

    add_index :hero_slots, :hero_id
    add_index :hero_slots, :player_id
    add_index :hero_slots, :loot_id, :unique => true

  end
end
