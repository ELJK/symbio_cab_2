class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.string :email
      t.string :eregime
      t.boolean :eactive

      t.string :phone
      t.string :pregime
      t.boolean :pactive

      t.integer :treatment_id

      t.timestamps
    end
  end
end
