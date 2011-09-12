class AddStoryToItems < ActiveRecord::Migration
  def change
    add_column :items, :story, :text
  end
end
