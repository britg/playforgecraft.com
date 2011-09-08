class CreateEnemies < ActiveRecord::Migration
  def change
    create_table :enemies do |t|
      t.string :name
      t.integer :level_min
      t.integer :level_max

      t.timestamps
    end
  end
end
