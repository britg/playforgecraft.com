# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110915023706) do

  create_table "active_admin_comments", :force => true do |t|
    t.integer  "resource_id",   :null => false
    t.string   "resource_type", :null => false
    t.integer  "author_id"
    t.string   "author_type"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "namespace"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], :name => "index_active_admin_comments_on_author_type_and_author_id"
  add_index "active_admin_comments", ["namespace"], :name => "index_active_admin_comments_on_namespace"
  add_index "active_admin_comments", ["resource_type", "resource_id"], :name => "index_admin_notes_on_resource_type_and_resource_id"

  create_table "admin_users", :force => true do |t|
    t.string   "email",                                 :default => "", :null => false
    t.string   "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_users", ["email"], :name => "index_admin_users_on_email", :unique => true
  add_index "admin_users", ["reset_password_token"], :name => "index_admin_users_on_reset_password_token", :unique => true

  create_table "classifications", :force => true do |t|
    t.integer   "genre_id"
    t.string    "name"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.string    "default_icon_file_name"
    t.string    "default_icon_content_type"
    t.integer   "default_icon_file_size"
    t.timestamp "default_icon_updated_at"
    t.string    "default_art_file_name"
    t.string    "default_art_content_type"
    t.integer   "default_art_file_size"
    t.timestamp "default_art_updated_at"
  end

  create_table "emails", :force => true do |t|
    t.string    "address"
    t.boolean   "delivered",  :default => false
    t.timestamp "created_at"
    t.timestamp "updated_at"
  end

  add_index "emails", ["address"], :name => "index_emails_on_address", :unique => true

  create_table "enemies", :force => true do |t|
    t.string    "name"
    t.integer   "level_min"
    t.integer   "level_max"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.string    "avatar_file_name"
    t.string    "avatar_content_type"
    t.integer   "avatar_file_size"
    t.timestamp "avatar_updated_at"
  end

  create_table "genres", :force => true do |t|
    t.string    "name"
    t.timestamp "created_at"
    t.timestamp "updated_at"
  end

  create_table "item_sets", :force => true do |t|
    t.string    "name"
    t.text      "description"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.string    "art_file_name"
    t.string    "art_content_type"
    t.integer   "art_file_size"
    t.timestamp "art_updated_at"
    t.string    "icon_file_name"
    t.string    "icon_content_type"
    t.integer   "icon_file_size"
    t.timestamp "icon_updated_at"
  end

  create_table "items", :force => true do |t|
    t.integer   "genre_id"
    t.integer   "classification_id"
    t.integer   "rarity_id"
    t.integer   "ore_id"
    t.integer   "item_set_id"
    t.string    "name"
    t.text      "description"
    t.integer   "attack_min"
    t.integer   "attack_max"
    t.integer   "defense_min"
    t.integer   "defense_max"
    t.boolean   "active"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.integer   "level",             :default => 0
    t.string    "icon_file_name"
    t.string    "icon_content_type"
    t.integer   "icon_file_size"
    t.timestamp "icon_updated_at"
    t.string    "art_file_name"
    t.string    "art_content_type"
    t.integer   "art_file_size"
    t.timestamp "art_updated_at"
    t.text      "story"
  end

  add_index "items", ["active"], :name => "index_items_on_active"
  add_index "items", ["classification_id"], :name => "index_items_on_classification_id"
  add_index "items", ["genre_id"], :name => "index_items_on_genre_id"
  add_index "items", ["item_set_id"], :name => "index_items_on_item_set_id"
  add_index "items", ["ore_id"], :name => "index_items_on_ore_id"
  add_index "items", ["rarity_id"], :name => "index_items_on_rarity_id"

  create_table "levels", :force => true do |t|
    t.integer   "level"
    t.integer   "experience_required"
    t.timestamp "created_at"
    t.timestamp "updated_at"
  end

  add_index "levels", ["level"], :name => "index_levels_on_level", :unique => true

  create_table "ores", :force => true do |t|
    t.string    "name"
    t.integer   "rank"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.string    "tile_file_name"
    t.string    "tile_content_type"
    t.integer   "tile_file_size"
    t.timestamp "tile_updated_at"
  end

  create_table "players", :force => true do |t|
    t.integer   "user_id"
    t.string    "name"
    t.integer   "level"
    t.integer   "experience"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.string    "avatar_file_name"
    t.string    "avatar_content_type"
    t.integer   "avatar_file_size"
    t.timestamp "avatar_updated_at"
  end

  add_index "players", ["name"], :name => "index_players_on_name", :unique => true
  add_index "players", ["user_id"], :name => "index_players_on_user_id", :unique => true

  create_table "rarities", :force => true do |t|
    t.string    "name"
    t.integer   "rank"
    t.timestamp "created_at"
    t.timestamp "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string    "email",                                 :default => "", :null => false
    t.string    "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string    "reset_password_token"
    t.timestamp "reset_password_sent_at"
    t.timestamp "remember_created_at"
    t.integer   "sign_in_count",                         :default => 0
    t.timestamp "current_sign_in_at"
    t.timestamp "last_sign_in_at"
    t.string    "current_sign_in_ip"
    t.string    "last_sign_in_ip"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.boolean   "admin"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
