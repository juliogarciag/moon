module Mutations
  class UndiscardEntry < BaseMutation
    argument :id, ID, required: true

    field :undiscarded, Boolean, null: false
    field :entry, Types::EntryType, null: false

    def resolve(id:)
      entry = Entry.find(id)
      undiscarded = entry.undiscard
      { undiscarded: undiscarded, entry: entry }
    end
  end
end
