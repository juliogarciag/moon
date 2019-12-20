module Types
  class QueryType < Types::BaseObject
    field :entries, [EntryType], null: true do
      description "All entries"
    end

    field :discarded_entries, [EntryType], null: true do
      description "Discarded Entries"
    end

    field :entry_versions, [EntryVersionType], null: true do
      description "Entry versions"
      argument :entry_id, ID, required: true
    end

    def entries
      Entry.kept
    end

    def discarded_entries
      Entry.discarded
    end

    def entry_versions(entry_id:)
      Entry.find(entry_id).entry_versions.order(created_at: :asc)
    end
  end
end
