class AddLevelToEnemies < ActiveRecord::Migration
  def change
    add_column :enemies, :level, :integer
    add_index :enemies, :level
  end
end
