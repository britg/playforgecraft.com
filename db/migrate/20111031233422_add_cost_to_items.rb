class AddCostToItems < ActiveRecord::Migration
  def change
    add_column :items, :cost, :integer
    add_column :ores, :cost, :integer, :default => 1
    add_column :classifications, :cost, :integer, :default => 1
  end
end
