class AddAccuracyToAction < ActiveRecord::Migration
  def change
    add_column :actions, :forgeable_accuracy, :integer
    add_column :actions, :forgeable_class, :string
    add_column :actions, :forgeable_ore, :string
    add_column :actions, :forgeable_mana_crystal, :boolean, :default => false
  end
end
