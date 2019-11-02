module Mutations
  class DeleteEntry < BaseMutation
    argument :id, ID, required: true

    field :deleted, Boolean, null: false
    field :entry, Types::EntryType, null: false

    def resolve(id:)
      entry = Entry.find(id)
      deleted = entry.destroy
      { deleted: deleted, entry: entry }
    end
  end
end
