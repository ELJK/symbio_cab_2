class AddRemainingParms < ActiveRecord::Migration
  def change
    add_column :users, :gender, :string
    add_column :users, :dob, :date
    add_column :users, :tel, :string

  end
end
