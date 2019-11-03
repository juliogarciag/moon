import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { Trash2, XSquare } from "react-feather";
import getEntriesQuery from "./getEntries.graphql";
import getDiscardedEntriesQuery from "./getDiscardedEntriesQuery.graphql";
import discardEntryMutation from "./discardEntry.graphql";
import deleteEntryMutation from "./deleteEntry.graphql";

function updateCacheAfterDiscard(cache, entry) {
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

function updateCacheAfterDelete(cache, entry) {
  const { entries } = cache.readQuery({ query: getEntriesQuery });
  cache.writeQuery({
    query: getEntriesQuery,
    data: { entries: entries.filter(e => e.id !== entry.id) }
  });
}

function DiscardEntryButton({ row: { original } }) {
  const [discardEntry] = useMutation(discardEntryMutation, {
    update(cache, { data }) {
      const { discardEntry } = data;
      if (discardEntry.discarded) {
        updateCacheAfterDiscard(cache, discardEntry.entry);
      }
    }
  });

  const [deleteEntry] = useMutation(deleteEntryMutation, {
    update(cache, { data }) {
      const { deleteEntry } = data;
      if (deleteEntry.deleted) {
        updateCacheAfterDelete(cache, deleteEntry.entry);
      }
    }
  });

  const handleClick = () => {
    if (original.isNew) {
      deleteEntry({ variables: { id: original.id } });
    } else {
      discardEntry({ variables: { id: original.id } });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mr-1"
      title={original.isNew ? "Delete Entry" : "Discard Entry"}
    >
      {original.isNew ? <XSquare size={18} /> : <Trash2 size={18} />}
    </button>
  );
}

export default DiscardEntryButton;
