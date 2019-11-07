require "csv"

Entry.destroy_all

CSV.foreach("./data.csv") do |row|
  description, raw_date, raw_amount = row
  date = Date.strptime(raw_date, "%m/%d/%Y")
  amount_cents = (raw_amount.to_d * 100).to_i

  Entry.create!(
    description: description,
    date: date,
    amount_cents: amount_cents,
    is_new: false
  )
end
