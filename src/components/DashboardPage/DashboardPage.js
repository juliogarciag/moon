import React, { useRef, useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
import EntriesTable from "./EntriesTable";
import getEntriesQuery from "./getEntries.graphql";
import processEntries from "./processEntries";
import TableSidebar from "./TableSidebar";
import Trash from "./Trash";

function DashboardPage({ rawEntries }) {
  const { entries, years, months, todayTotal } = processEntries(rawEntries);

  const tableWindowRef = useRef(null);

  const goToEntryId = useCallback(
    entryId => {
      const entryIndex = entries.findIndex(entry => entry.id === entryId);
      tableWindowRef.current.scrollToItem(entryIndex, "smart");
    },
    [entries, tableWindowRef.current]
  );

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

function DashboardPageContainer() {
  const { loading, error, data } = useQuery(getEntriesQuery);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error.</p>;
  }

  return <DashboardPage rawEntries={data.entries} />;
}

export default DashboardPageContainer;
