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

ActiveRecord::Schema.define(:version => 20111016183204) do

  create_table "actions", :force => true do |t|
    t.integer  "game_id"
    t.integer  "player_id"
    t.integer  "loot_id"
    t.integer  "turn"
    t.string   "action"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "forgeable_accuracy"
    t.string   "forgeable_class"
    t.string   "forgeable_ore"
    t.boolean  "forgeable_mana_crystal", :default => false
  end

  add_index "actions", ["game_id", "turn"], :name => "index_actions_on_game_id_and_turn", :unique => true
  add_index "actions", ["game_id"], :name => "index_actions_on_game_id"
  add_index "actions", ["player_id"], :name => "index_actions_on_player_id"

  create_table "actions_tiles", :id => false, :force => true do |t|
    t.integer "action_id"
    t.integer "tile_id"
  end

  add_index "actions_tiles", ["action_id"], :name => "index_actions_tiles_on_action_id"
  add_index "actions_tiles", ["tile_id", "action_id"], :name => "index_actions_tiles_on_tile_id_and_action_id", :unique => true
  add_index "actions_tiles", ["tile_id"], :name => "index_actions_tiles_on_tile_id"

  create_table "active_admin_comments", :force => true do |t|
    t.integer   "resource_id",   :null => false
    t.string    "resource_type", :null => false
    t.integer   "author_id"
    t.string    "author_type"
    t.text      "body"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.string    "namespace"
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

  create_table "games", :force => true do |t|
    t.string   "game_type"
    t.integer  "challenger_id"
    t.integer  "challengee_id"
    t.integer  "winner_id"
    t.integer  "loser_id"
    t.integer  "challenger_attack_score",    :default => 0
    t.integer  "challenger_defense_score",   :default => 0
    t.integer  "challengee_attack_score",    :default => 0
    t.integer  "challengee_defense_score",   :default => 0
    t.integer  "start_turns",                :default => 0
    t.integer  "challenger_turns_remaining", :default => 0
    t.integer  "challengee_turns_remaining", :default => 0
    t.datetime "challenger_last_action"
    t.datetime "challengee_last_action"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "games", ["challengee_id"], :name => "index_games_on_challengee_id"
  add_index "games", ["challenger_id"], :name => "index_games_on_challenger_id"
  add_index "games", ["game_type"], :name => "index_games_on_type"
  add_index "games", ["loser_id"], :name => "index_games_on_loser_id"
  add_index "games", ["winner_id"], :name => "index_games_on_winner_id"

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

  create_table "loots", :force => true do |t|
    t.integer  "player_id"
    t.integer  "game_id"
    t.integer  "action_id"
    t.integer  "item_id"
    t.integer  "attack"
    t.integer  "defense"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "loots", ["action_id"], :name => "index_loots_on_action_id", :unique => true
  add_index "loots", ["game_id"], :name => "index_loots_on_game_id"
  add_index "loots", ["item_id"], :name => "index_loots_on_item_id"
  add_index "loots", ["player_id"], :name => "index_loots_on_player_id"

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

  create_table "tiles", :force => true do |t|
    t.integer   "game_id"
    t.integer   "x",          :default => 0
    t.integer   "y",          :default => 0
    t.integer   "ore_id"
    t.timestamp "created_at"
    t.timestamp "updated_at"
    t.boolean   "consumed",   :default => false
  end

  add_index "tiles", ["game_id"], :name => "index_tiles_on_game_id"

  create_table "tiles_turns", :id => false, :force => true do |t|
    t.integer "tile_id"
    t.integer "turn_id"
  end

  add_index "tiles_turns", ["tile_id", "turn_id"], :name => "index_tiles_turns_on_tile_id_and_turn_id", :unique => true
  add_index "tiles_turns", ["tile_id"], :name => "index_tiles_turns_on_tile_id"
  add_index "tiles_turns", ["turn_id"], :name => "index_tiles_turns_on_turn_id"

  create_table "turns", :force => true do |t|
    t.integer  "game_id"
    t.integer  "player_id"
    t.integer  "loot_id"
    t.integer  "number"
    t.string   "action"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "turns", ["game_id", "number"], :name => "index_turns_on_game_id_and_number", :unique => true
  add_index "turns", ["game_id"], :name => "index_turns_on_game_id"
  add_index "turns", ["player_id"], :name => "index_turns_on_player_id"

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

  create_table "versions", :force => true do |t|
    t.string    "item_type",  :null => false
    t.integer   "item_id",    :null => false
    t.string    "event",      :null => false
    t.string    "whodunnit"
    t.text      "object"
    t.timestamp "created_at"
  end

  add_index "versions", ["item_type", "item_id"], :name => "index_versions_on_item_type_and_item_id"

end
