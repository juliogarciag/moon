import React from "react";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import ApolloClient, { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

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

function EntriesTable() {
  const { loading, error, data } = useQuery(GET_ENTRIES_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error.</p>;
  }

  return (
    <ul>
      {data.entries.map(entry => (
        <li key={entry.id}>
          {entry.description} | {entry.amountCents} | {entry.date}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <EntriesTable />
    </ApolloProvider>
  );
}
