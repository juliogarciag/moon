class Entry < ApplicationRecord
  include Discard::Model

  before_update :mark_as_not_new
  before_destroy :check_if_new_entry

  def mark_as_not_new
    self.is_new = false if changed?
  end

  def check_if_new_entry
    throw :abort unless is_new?
  end
end
