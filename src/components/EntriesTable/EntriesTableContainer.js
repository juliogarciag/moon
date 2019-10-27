import React from "react";
import { useQuery } from "@apollo/react-hooks";
import EntriesTable from "./EntriesTable";
import getEntriesQuery from "./getEntries.graphql";
import processEntries from "./processEntries";

function EntriesTableContainer() {
  const { loading, error, data } = useQuery(getEntriesQuery);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error.</p>;
  }

  const { entries, years, months } = processEntries(data.entries);

  return <EntriesTable entries={entries} years={years} months={months} />;
}

export default EntriesTableContainer;
