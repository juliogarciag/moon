import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { PlusSquare } from "react-feather";
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
    <button onClick={handleCreate} className="mr-2">
      <PlusSquare size={18} />
    </button>
  );
}

export default CreateEntryButton;
