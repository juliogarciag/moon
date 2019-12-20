class EntryVersion < ApplicationRecord
  belongs_to :entry

  def description
    entry_attributes["description"]
  end

  def amount_cents
    entry_attributes["amount_cents"].to_i
  end

  def date
    Date.parse(entry_attributes["date"])
  end
end
