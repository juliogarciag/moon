import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { PlusSquare } from "react-feather";
import getEntriesQuery from "./getEntries.graphql";
import createEntryMutation from "./createEntry.graphql";

function CreateEntryButton({ row: { original: entry } }) {
  const [createEntry] = useMutation(createEntryMutation, {
    update(cache, { data: { createEntry } }) {
      const { entries } = cache.readQuery({ query: getEntriesQuery });
      cache.writeQuery({
        query: getEntriesQuery,
        data: { entries: entries.concat([createEntry.entry]) }
      });
    }
  });

  const handleCreate = () =>
    createEntry({
      variables: {
        date: entry.date,
        amountCents: 0,
        description: ""
      }
    });

  return (
    <button onClick={handleCreate} className="mr-2" title="Create Entry">
      <PlusSquare
        size={18}
        strokeWidth={entry.isLastOfMonth || entry.isLastOfYear ? 2.5 : 2}
      />
    </button>
  );
}

export default CreateEntryButton;
