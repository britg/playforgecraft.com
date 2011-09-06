class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|

      t.references :genre
      t.references :classification
      t.references :rarity
      t.references :ore
      t.references :item_set

      t.string :name
      t.text :description
      t.integer :attack_min
      t.integer :attack_max
      t.integer :defense_min
      t.integer :defense_max
      t.boolean :active, :default => true

      t.timestamps

    end

    add_index :items, :genre_id
    add_index :items, :classification_id
    add_index :items, :rarity_id
    add_index :items, :ore_id
    add_index :items, :item_set_id
    add_index :items, :active
  end
end
