import React from "react";
import { useMutation } from "@apollo/react-hooks";
import getEntriesQuery from "./getEntries.graphql";
import createEntryMutation from "./createEntry.graphql";

function CreateEntryButton({ row: { original } }) {
  const [createEntry] = useMutation(createEntryMutation, {
    update(
      cache,
      {
        data: { createEntry }
      }
    ) {
      const { entries } = cache.readQuery({ query: getEntriesQuery });
      cache.writeQuery({
        query: getEntriesQuery,
        data: { entries: entries.concat([createEntry.entry]) }
      });
    }
  });

  const handleCreate = () => {
    createEntry({
      variables: {
        date: original.date,
        amountCents: 0,
        description: "New Entry"
      }
    });
  };

  return (
    <button
      className="font-bold text-white text-xs bg-blue-500 p-2 focus:outline-none"
      onClick={handleCreate}
    >
      Add Entry
    </button>
  );
}

export default CreateEntryButton;
