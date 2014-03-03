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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140225115201) do

  create_table "notifications", force: true do |t|
    t.string   "email"
    t.string   "eregime"
    t.boolean  "eactive"
    t.string   "phone"
    t.string   "pregime"
    t.boolean  "pactive"
    t.integer  "treatment_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "econfirmation_code"
    t.boolean  "econfirmed",         default: false
  end

  create_table "schedules", force: true do |t|
    t.date     "d"
    t.integer  "ps"
    t.integer  "psr"
    t.integer  "s1"
    t.integer  "s1r"
    t.integer  "s2"
    t.integer  "s2r"
    t.integer  "ss"
    t.integer  "ssr"
    t.integer  "treatment_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "schedules", ["d"], name: "index_schedules_on_d"
  add_index "schedules", ["treatment_id", "created_at"], name: "index_schedules_on_treatment_id_and_created_at"

  create_table "treatments", force: true do |t|
    t.string   "dname"
    t.string   "dsurname"
    t.string   "dclinic"
    t.string   "tprog"
    t.date     "tdate"
    t.date     "tph0_s"
    t.date     "tph0_e"
    t.date     "tph1_s"
    t.date     "tph1_e"
    t.date     "tph2_s"
    t.date     "tph2_e"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "treatments", ["user_id", "created_at"], name: "index_treatments_on_user_id_and_created_at"

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "surname"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "password_digest"
    t.string   "gender"
    t.date     "dob"
    t.string   "tel"
    t.string   "remember_token"
    t.boolean  "admin",           default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["remember_token"], name: "index_users_on_remember_token"

end
