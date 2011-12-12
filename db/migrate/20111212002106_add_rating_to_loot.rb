class AddRatingToLoot < ActiveRecord::Migration
  def change
    add_column :loots, :rating, :integer
    add_index :loots, :rating
  end
end
