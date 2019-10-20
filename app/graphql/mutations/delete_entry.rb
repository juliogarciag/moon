module Mutations
  class DeleteEntry < BaseMutation
    argument :id, ID, required: true

    field :deleted, Boolean, null: false

    def resolve(id:)
      entry = Entry.find(id)
      { deleted: entry.destroy }
    end
  end
end
