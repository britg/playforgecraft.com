class CreateItemSets < ActiveRecord::Migration
  def change
    create_table :item_sets do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
