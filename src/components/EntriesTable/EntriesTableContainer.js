import React from "react";
import { useQuery } from "@apollo/react-hooks";
import EntriesTable from "./EntriesTable";
import getEntriesQuery from "./getEntries.graphql";

function EntriesTableContainer() {
  const { loading, error, data } = useQuery(getEntriesQuery);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error.</p>;
  }

  return <EntriesTable entries={data.entries} />;
}

export default EntriesTableContainer;
