module Mutations
  class CreateEntry < BaseMutation
    argument :description, String, required: true
    argument :amount_cents, Int, required: true
    argument :date, GraphQL::Types::ISO8601Date, required: true

    field :entry, Types::EntryType, null: true
    field :errors, [String], null: false

    def resolve(arguments)
      entry = Entry.create(arguments)
      if entry.persisted?
        {
          entry: entry,
          errors: []
        }
      else
        {
          entry: null,
          errors: entry.errors.full_messages
        }
      end
    end
  end
end
