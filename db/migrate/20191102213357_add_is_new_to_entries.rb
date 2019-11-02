class AddIsNewToEntries < ActiveRecord::Migration[5.2]
  def up
    add_column :entries, :is_new, :boolean, default: true
    Entry.update_all(is_new: false)
  end

  def down
    remove_column :entries, :is_new, :boolean
  end
end
