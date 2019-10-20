module Types
  class EntryType < Types::BaseObject
    field :id, ID, null: false
    field :description, String, null: false
    field :amount_cents, Integer, null: false
    field :date, GraphQL::Types::ISO8601Date, null: false
  end
end
