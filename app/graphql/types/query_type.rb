module Types
  class QueryType < Types::BaseObject
    field :entries, [EntryType], null: true do
      description "All entries"
    end

    def entries
      Entry.kept
    end
  end
end
