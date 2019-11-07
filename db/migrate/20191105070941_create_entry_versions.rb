class CreateEntryVersions < ActiveRecord::Migration[5.2]
  def change
    create_table :entry_versions do |t|
      t.references :entry, foreign_key: true
      t.jsonb :entry_attributes
      t.jsonb :entry_changes

      t.timestamps
    end
  end
end
