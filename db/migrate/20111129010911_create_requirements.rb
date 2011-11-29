class CreateRequirements < ActiveRecord::Migration
  def change
    create_table :requirements do |t|

      t.references :mine
      t.references :ore
      t.references :classification
      t.references :genre
      t.references :rarity

      t.integer :quantity

      t.timestamps
    end

    add_index :requirements, :mine_id
  end
end
