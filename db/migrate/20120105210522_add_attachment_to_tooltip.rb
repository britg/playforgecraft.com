class AddAttachmentToTooltip < ActiveRecord::Migration
  def change
    add_column :tooltips, :image_file_name, :string
    add_column :tooltips, :image_file_size, :integer
    add_column :tooltips, :image_content_type, :string
    add_column :tooltips, :image_updated_at, :datetime
    add_column :tooltips, :page, :integer
    add_index :tooltips, :page
  end
end
