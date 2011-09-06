class CreateRarities < ActiveRecord::Migration
  def change
    create_table :rarities do |t|
      t.string :name
      t.integer :rank

      t.timestamps
    end
  end
end
