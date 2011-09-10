class CreateEmails < ActiveRecord::Migration
  def change
    create_table :emails do |t|
      
      t.string :address
      t.boolean :delivered, :default => false

      t.timestamps
      
    end

    add_index :emails, :address, :unique => true
  end
end
