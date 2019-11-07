import { sortWith, prop, ascend } from "ramda";
import { differenceInDays } from "date-fns";
import calculateMonths from "./calculateMonths";

const sortEntries = sortWith([
  ascend(prop("dateAsDate")),
  ascend(prop("createdAt"))
]);
const addDateAsDateProperty = entry => ({
  ...entry,
  dateAsDate: new Date(entry.date)
});

function getEntryDatePredicates(entries, entry, index) {
  const nextEntry = entries[index + 1];
  const getYear = entry => entry.dateAsDate.getUTCFullYear();
  const getMonth = entry => entry.dateAsDate.getUTCMonth();

  if (nextEntry) {
    if (getYear(entry) !== getYear(nextEntry)) {
      return { isLastOfYear: true, isLastOfMonth: true, isLastOfTrail: false };
    } else if (getMonth(entry) !== getMonth(nextEntry)) {
      return { isLastOfYear: false, isLastOfMonth: true, isLastOfTrail: false };
    } else {
      return {
        isLastOfYear: false,
        isLastOfMonth: false,
        isLastOfTrail: false
      };
    }
  } else {
    return { isLastOfYear: true, isLastOfMonth: true, isLastOfTrail: true };
  }
}

function processEntries(rawEntries) {
  const entriesWithDates = rawEntries.map(addDateAsDateProperty);
  const sortedEntries = sortEntries(entriesWithDates);

  const today = new Date();
  let total = 0;
  let todayTotal = 0;

  const entries = sortedEntries.map((entry, index) => {
    total += entry.amountCents;
    if (entry.dateAsDate <= today) {
      todayTotal += entry.amountCents;
    }

    return {
      id: entry.id,
      description: entry.description,
      date: entry.date,
      amountCents: entry.amountCents,
      isNew: entry.isNew,
      totalCents: total,
      todayCloseness: Math.abs(differenceInDays(entry.dateAsDate, today)),
      isInTheFuture: entry.dateAsDate > today,
      ...getEntryDatePredicates(sortedEntries, entry, index)
    };
  });

  const { years, months } = calculateMonths(sortedEntries);

  return { entries, years, months, todayTotal };
}

export default processEntries;
