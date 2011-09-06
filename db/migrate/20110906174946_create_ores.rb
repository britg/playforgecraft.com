class CreateOres < ActiveRecord::Migration
  def change
    create_table :ores do |t|
      t.string :name
      t.integer :rank

      t.timestamps
    end
  end
end
