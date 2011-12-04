class AddLastActiveAtToPlayer < ActiveRecord::Migration
  def change
    add_column :players, :last_active_at, :timestamp
  end
end
