import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import numbro from "numbro";
import getEntriesQuery from "./getEntries.graphql";
import getDiscardedEntriesQuery from "./getDiscardedEntriesQuery.graphql";
import undiscardEntryMutation from "./undiscardEntryMutation.graphql";

function updateCache(cache, entry) {
  const { discardedEntries } = cache.readQuery({
    query: getDiscardedEntriesQuery
  });
  const { entries } = cache.readQuery({ query: getEntriesQuery });

  cache.writeQuery({
    query: getDiscardedEntriesQuery,
    data: {
      discardedEntries: discardedEntries.filter(e => e.id !== entry.id)
    }
  });

  cache.writeQuery({
    query: getEntriesQuery,
    data: {
      entries: entries.concat([entry])
    }
  });
}

function DiscardedEntry({ entry }) {
  const [undiscardEntry] = useMutation(undiscardEntryMutation, {
    update(cache, { data }) {
      const { undiscardEntry } = data;

      if (undiscardEntry.undiscarded) {
        updateCache(cache, undiscardEntry.entry);
      }
    }
  });

  const handleUndiscard = entryId => {
    undiscardEntry({
      variables: {
        id: entryId
      }
    });
  };

  return (
    <>
      <div>{entry.description}</div>
      <div>{entry.date}</div>
      <div>
        {numbro(entry.amountCents / 100).formatCurrency({
          average: false,
          thousandSeparated: true,
          mantissa: 2
        })}
      </div>
      <div>
        <button onClick={() => handleUndiscard(entry.id)}>Add to Trail</button>
      </div>
    </>
  );
}

function Trash() {
  const { loading, error, data } = useQuery(getDiscardedEntriesQuery);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error.</p>;
  }

  return (
    <ul>
      {data.discardedEntries.map(entry => (
        <li key={entry.id}>
          <DiscardedEntry entry={entry} />
        </li>
      ))}
    </ul>
  );
}

export default Trash;
