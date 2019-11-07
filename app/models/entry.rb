class Entry < ApplicationRecord
  include Discard::Model

  has_many :entry_versions, dependent: :destroy

  before_update :mark_as_not_new
  before_destroy :check_if_new_entry

  def mark_as_not_new
    self.is_new = false if changed?
  end

  def check_if_new_entry
    throw :abort unless is_new?
  end

  def log_version(previous_attributes)
    if saved_changes?
      entry_versions.create(
        entry_attributes: previous_attributes.except("versions"),
        entry_changes: previous_changes.except("created_at", "updated_at")
      )
    end
  end
end
