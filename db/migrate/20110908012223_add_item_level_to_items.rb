class AddItemLevelToItems < ActiveRecord::Migration
  def change
    add_column :items, :level, :integer, :default => 0
  end
end
