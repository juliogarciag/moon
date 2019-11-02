import { groupBy } from "ramda";

const groupByEntryYear = groupBy(entry => entry.date.getUTCFullYear());
const groupByEntryMonth = groupBy(entry => entry.date.getUTCMonth());

function calculateMonths(entries) {
  const entriesWithDates = entries.map(entry => ({
    ...entry,
    date: new Date(entry.date)
  }));

  const groupedByYear = groupByEntryYear(entriesWithDates);

  const months = {};
  const years = Object.keys(groupedByYear);

  years.forEach(year => {
    const yearEntries = groupedByYear[year];
    const groupedByMonth = groupByEntryMonth(yearEntries);

    months[year] = Object.entries(groupedByMonth).map(
      ([month, monthEntries]) => {
        const firstEntryId = monthEntries[0].id;
        return {
          firstEntryId,
          month: Number(month),
          entriesCount: monthEntries.length
        };
      }
    );
  });

  return {
    years,
    months
  };
}

export default calculateMonths;
