class AddConfirmationToNotifications < ActiveRecord::Migration
  def change

    add_column :notifications, :econfirmation_code, :string
    add_column :notifications, :econfirmed, :boolean, default: false

  end
end
