import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import EntriesTable from "./EntriesTable";

const GET_ENTRIES_QUERY = gql`
  {
    entries {
      id
      description
      date
      amountCents
    }
  }
`;

function EntriesTableContainer() {
  const { loading, error, data } = useQuery(GET_ENTRIES_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error.</p>;
  }

  return <EntriesTable entries={data.entries} />;
}

export default EntriesTableContainer;
