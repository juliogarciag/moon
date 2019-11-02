module Mutations
  class UpdateEntry < BaseMutation
    argument :id, ID, required: true
    argument :description, String, required: false
    argument :amount_cents, Int, required: false
    argument :date, GraphQL::Types::ISO8601Date, required: false

    field :entry, Types::EntryType, null: true
    field :errors, [String], null: false

    def resolve(arguments)
      entry = Entry.find(arguments[:id])
      entry.assign_attributes(arguments.except(:id))

      if !entry.changed? || entry.save
        {
          entry: entry,
          errors: []
        }
      else
        {
          entry: nil,
          errors: entry.errors.full_messages
        }
      end
    end
  end
end
