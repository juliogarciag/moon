import React, { useRef, useCallback, useState, useEffect } from "react";
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

  const [selection, selectionSetter] = useState({
    entryId: null,
    columnId: null,
    isOpen: false
  });

  const [newEntryId, setNewEntryId] = useState(null);

  useEffect(() => {
    if (newEntryId) {
      const newEntry = entries.find(entry => entry.id === newEntryId);
      if (newEntry) {
        goToEntryId(newEntryId, "description", true);
        setNewEntryId(null);
      }
    }
  }, [entries, newEntryId, setNewEntryId]);

  const goToEntryId = useCallback(
    (entryId, columnId = "description", isOpen = false) => {
      const entryIndex = entries.findIndex(entry => entry.id === entryId);
      tableWindowRef.current.scrollToItem(entryIndex, "smart");
      document.querySelector("[data-entries-table]").focus();
      selectionSetter({ entryId, columnId, isOpen });
    },
    [entries, selectionSetter, tableWindowRef.current]
  );

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
        <EntriesTable
          entries={entries}
          tableWindowRef={tableWindowRef}
          setNewEntryId={setNewEntryId}
        />
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
