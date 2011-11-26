class CreateZones < ActiveRecord::Migration
  def change
    create_table :zones do |t|

      t.string :name
      t.string :description
      t.integer :lower_level
      t.integer :upper_level

      t.timestamps
      
    end
  end
end
