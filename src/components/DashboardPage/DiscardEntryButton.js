import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { Trash2 } from "react-feather";
import getEntriesQuery from "./getEntries.graphql";
import getDiscardedEntriesQuery from "./getDiscardedEntriesQuery.graphql";
import discardEntryMutation from "./discardEntry.graphql";

function updateCache(cache, entry) {
  const { entries } = cache.readQuery({ query: getEntriesQuery });
  const { discardedEntries } = cache.readQuery({
    query: getDiscardedEntriesQuery
  });

  cache.writeQuery({
    query: getEntriesQuery,
    data: { entries: entries.filter(e => e.id !== entry.id) }
  });
  cache.writeQuery({
    query: getDiscardedEntriesQuery,
    data: {
      discardedEntries: discardedEntries.concat([entry])
    }
  });
}

function DiscardEntryButton({ row: { original } }) {
  const [discardEntry] = useMutation(discardEntryMutation, {
    update(cache, { data }) {
      const { discardEntry } = data;
      if (discardEntry.discarded) {
        updateCache(cache, discardEntry.entry);
      }
    }
  });

  const handleClick = () => {
    discardEntry({ variables: { id: original.id } });
  };

  return (
    <button onClick={handleClick} className="mr-1">
      <Trash2 size={18} />
    </button>
  );
}

export default DiscardEntryButton;
