import React, { useRef } from "react";
import { useQuery } from "@apollo/react-hooks";
import EntriesTable from "./EntriesTable";
import getEntriesQuery from "./getEntries.graphql";
import processEntries from "./processEntries";
import TableSidebar from "./TableSidebar";
import Trash from "./Trash";

function DashboardPage() {
  const { loading, error, data } = useQuery(getEntriesQuery);

  const tableWindowRef = useRef(null);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error.</p>;
  }

  const { entries, years, months, todayTotal } = processEntries(data.entries);

  const goToEntryId = entryId => {
    const entryIndex = entries.findIndex(entry => entry.id === entryId);
    tableWindowRef.current.scrollToItem(entryIndex);
  };

  return (
    <div className="flex">
      <EntriesTable entries={entries} tableWindowRef={tableWindowRef} />
      <TableSidebar
        entries={entries}
        years={years}
        months={months}
        todayTotal={todayTotal}
        goToEntryId={goToEntryId}
      />
      <Trash />
    </div>
  );
}

export default DashboardPage;
