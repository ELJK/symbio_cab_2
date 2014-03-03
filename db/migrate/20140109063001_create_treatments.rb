class CreateTreatments < ActiveRecord::Migration
  def change
    create_table :treatments do |t|

      t.string :dname
      t.string :dsurname
      t.string :dclinic

      t.string :tprog

      t.date :tdate
      t.date :tph0_s
      t.date :tph0_e
      t.date :tph1_s
      t.date :tph1_e
      t.date :tph2_s
      t.date :tph2_e

      t.integer :user_id

      t.timestamps
    end

    add_index :treatments, [:user_id, :created_at]

  end
end
