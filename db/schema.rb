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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_11_05_070941) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "entries", force: :cascade do |t|
    t.string "description"
    t.integer "amount_cents"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "discarded_at"
    t.boolean "is_new", default: true
    t.index ["discarded_at"], name: "index_entries_on_discarded_at"
  end

  create_table "entry_versions", force: :cascade do |t|
    t.bigint "entry_id"
    t.jsonb "entry_attributes"
    t.jsonb "entry_changes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entry_id"], name: "index_entry_versions_on_entry_id"
  end

  add_foreign_key "entry_versions", "entries"
end
