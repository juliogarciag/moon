import React, { useRef, useCallback, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import SelectionContext from "./SelectionContext";
import EntriesTable from "./EntriesTable";
import getEntriesQuery from "./getEntries.graphql";
import processEntries from "./processEntries";
import TableSidebar from "./TableSidebar";
import Trash from "./Trash";

function DashboardPage({ rawEntries }) {
  const { entries, years, months, todayTotal } = processEntries(rawEntries);

  const tableWindowRef = useRef(null);

  const goToEntryId = useCallback(
    (entryId, columnId = "description", isOpen = false) => {
      const entryIndex = entries.findIndex(entry => entry.id === entryId);
      tableWindowRef.current.scrollToItem(entryIndex, "smart");
      document.querySelector("[data-entries-table]").focus();
      selectionSetter({ entryId, columnId, isOpen });
    },
    [entries, tableWindowRef.current]
  );

  const [selection, selectionSetter] = useState({
    entryId: null,
    columnId: null,
    isOpen: false
  });

  const setSelection = selection => {
    if (selection.entryId) {
      goToEntryId(selection.entryId, selection.columnId, selection.isOpen);
    } else {
      selectionSetter(selection);
    }
  };

  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
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
    </SelectionContext.Provider>
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
