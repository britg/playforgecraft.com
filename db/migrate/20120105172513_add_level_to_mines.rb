class AddLevelToMines < ActiveRecord::Migration
  def change
    add_column :mines, :level, :integer
    add_index :mines, :level
  end
end
