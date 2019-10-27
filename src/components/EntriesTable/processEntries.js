import { sortBy } from "ramda";
import calculateMonths from "./calculateMonths";

const sortEntries = sortBy(entry => new Date(entry.date));

function processEntries(rawEntries) {
  const sortedEntries = sortEntries(rawEntries);
  let total = 0;

  const entries = sortedEntries.map(entry => {
    total = total + entry.amountCents;
    return {
      id: entry.id,
      description: entry.description,
      date: entry.date,
      amountCents: entry.amountCents,
      totalCents: total
    };
  });

  const { years, months } = calculateMonths(sortedEntries);

  return { entries, years, months };
}

export default processEntries;
