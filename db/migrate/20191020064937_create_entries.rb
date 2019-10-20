class CreateEntries < ActiveRecord::Migration[5.2]
  def change
    create_table :entries do |t|
      t.string :description
      t.integer :amount_cents
      t.date :date

      t.timestamps
    end
  end
end
