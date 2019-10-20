module Types
  class MutationType < Types::BaseObject
    field :create_entry, mutation: Mutations::CreateEntry
    field :delete_entry, mutation: Mutations::DeleteEntry
    field :update_entry, mutation: Mutations::UpdateEntry
  end
end
