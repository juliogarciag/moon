module Types
  class QueryType < Types::BaseObject
    field :entries, [EntryType], null: true do
      description "All entries"
    end

    field :discarded_entries, [EntryType], null: true do
      description "Discarded Entries"
    end

    def entries
      Entry.kept
    end

    def discarded_entries
      Entry.discarded
    end
  end
end
