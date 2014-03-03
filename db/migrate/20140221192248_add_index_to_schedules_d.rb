class AddIndexToSchedulesD < ActiveRecord::Migration
  def change
    add_index :schedules, :d
  end
end
