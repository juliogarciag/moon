module Types
  class MutationType < Types::BaseObject
    field :create_entry, mutation: Mutations::CreateEntry
    field :discard_entry, mutation: Mutations::DiscardEntry
    field :update_entry, mutation: Mutations::UpdateEntry
    field :undiscard_entry, mutation: Mutations::UndiscardEntry
  end
end
