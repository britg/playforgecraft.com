class AddUrlNameToPlayer < ActiveRecord::Migration
  def change
    add_column :players, :url_name, :string
    add_index :players, :url_name, :unique => true
  end
end
