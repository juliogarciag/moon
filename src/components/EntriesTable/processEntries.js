import { sortBy, prop } from "ramda";
import { differenceInDays } from "date-fns";
import calculateMonths from "./calculateMonths";

const sortEntries = sortBy(prop("dateAsDate"));
const addParsedDateToEntry = entry => ({
  ...entry,
  dateAsDate: new Date(entry.date)
});

function processEntries(rawEntries) {
  const entriesWithDates = rawEntries.map(addParsedDateToEntry);
  const sortedEntries = sortEntries(entriesWithDates);

  const today = new Date();
  let total = 0;
  let todayTotal = 0;

  const entries = sortedEntries.map(entry => {
    total += entry.amountCents;
    if (entry.dateAsDate <= today) {
      todayTotal += entry.amountCents;
    }

    return {
      id: entry.id,
      description: entry.description,
      date: entry.date,
      amountCents: entry.amountCents,
      totalCents: total,
      todayCloseness: Math.abs(differenceInDays(entry.dateAsDate, today))
    };
  });

  const { years, months } = calculateMonths(sortedEntries);

  return { entries, years, months, todayTotal };
}

export default processEntries;
