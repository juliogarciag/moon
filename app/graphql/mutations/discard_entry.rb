module Mutations
  class DiscardEntry < BaseMutation
    argument :id, ID, required: true

    field :discarded, Boolean, null: false
    field :entry, Types::EntryType, null: false

    def resolve(id:)
      entry = Entry.find(id)
      discarded = entry.discard
      { discarded: discarded, entry: entry }
    end
  end
end
