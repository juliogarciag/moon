import React, { memo, useEffect, useState } from "react";
import { sortBy, identity, prop, last } from "ramda";
import numbro from "numbro";
import { Link } from "react-feather";
import getLocalizedMonth from "./getLocalizedMonth";

function TableSidebar({ entries, years, months, todayTotal, goToEntryId }) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const goToMostRecentEntry = () => {
    const notFutureEntries = entries.filter(entry => !entry.isInTheFuture);
    const everyCloseness = notFutureEntries.map(prop("todayCloseness"));
    const smallestCloseness = sortBy(identity, everyCloseness)[0];
    const mostRecentEntries = entries.filter(
      entry => entry.todayCloseness === smallestCloseness
    );
    const mostRecentEntry = last(mostRecentEntries);

    if (mostRecentEntry) {
      goToEntryId(mostRecentEntry.id);
    }
  };

  useEffect(() => {
    if (!hasScrolled) {
      goToMostRecentEntry();
      setHasScrolled(true);
    }
  }, [hasScrolled, goToMostRecentEntry]);

  return (
    <div className="py-2 h-screen overflow-auto text-sm border-r border-solid border-black">
      <div className="pb-2 px-4 border-b border-black border-solid mb-2">
        <span className="font-bold">Total: </span>
        <span className="font-mono leading-none">
          {numbro(todayTotal / 100).formatCurrency({
            average: false,
            thousandSeparated: true,
            mantissa: 2,
            currencySymbol: "$ "
          })}
        </span>
      </div>
      <div className="px-4 pb-2 border-b border-black">
        <button onClick={goToMostRecentEntry} className="hover:underline">
          <Link size={12} className="inline mr-2" />
          Most Recent
        </button>
      </div>
      <ul>
        {years.map(year => (
          <li key={year}>
            <div className="px-4 pt-2 font-bold">{year}</div>
            <ul className="pl-4 py-2 border-b border-black">
              {months[year].map(({ month, firstEntryId }) => {
                return (
                  <li key={month}>
                    <button
                      className="hover:underline"
                      onClick={() => goToEntryId(firstEntryId)}
                    >
                      <Link size={12} className="inline mr-2" />
                      {getLocalizedMonth(month)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(TableSidebar);
