import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import numbro from "numbro";
import { Trash2 } from "react-feather";
import classNames from "classnames";
import { formatDate } from "lib/formatDateAndTime";
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
      <div
        className="text-gray-800 font-medium truncate"
        title={entry.description}
      >
        {entry.description}
      </div>
      <div className="font-light">{formatDate(entry.date)}</div>
      <div className="font-mono text-right">
        {numbro(entry.amountCents / 100).formatCurrency({
          average: false,
          thousandSeparated: true,
          mantissa: 2
        })}
      </div>
      <div>
        <button
          className="py-1 px-2 bg-gray-600 text-white mt-2"
          onClick={() => handleUndiscard(entry.id)}
        >
          Restore
        </button>
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

  const { discardedEntries } = data;

  return (
    <ul className="text-sm h-screen border-r border-black border-solid overflow-auto">
      <h2 className="font-bold border-b border-black border-solid p-2 w-40 flex items-center">
        <Trash2 size={14} color="rgb(120, 120, 120)" />
        <span className="ml-2">Trash</span>{" "}
      </h2>
      {discardedEntries.length === 0 ? (
        <p className="text-center p-2 text-gray-500">0 discarded entries.</p>
      ) : (
        <p className="text-center p-2">
          {discardedEntries.length}{" "}
          {discardedEntries.length === 1
            ? "discarded entry."
            : "discarded entries."}
        </p>
      )}
      {discardedEntries.map((entry, index) => (
        <li
          key={entry.id}
          className={classNames("w-40 p-2 border-b border-black border-solid", {
            "border-t": index === 0
          })}
        >
          <DiscardedEntry entry={entry} />
        </li>
      ))}
    </ul>
  );
}

export default Trash;
