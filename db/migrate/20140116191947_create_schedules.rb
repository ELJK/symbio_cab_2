class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
      t.date :d
      t.integer :ps
      t.integer :psr
      t.integer :s1
      t.integer :s1r
      t.integer :s2
      t.integer :s2r
      t.integer :ss
      t.integer :ssr

      t.integer :treatment_id

      t.timestamps
    end

    add_index :schedules, [:treatment_id, :created_at]

  end
end
