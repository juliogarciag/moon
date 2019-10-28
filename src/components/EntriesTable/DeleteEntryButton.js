import React from "react";
import { useMutation } from "@apollo/react-hooks";
import getEntriesQuery from "./getEntries.graphql";
import deleteEntryMutation from "./deleteEntry.graphql";

function DeleteEntryButton({ row: { original } }) {
  const [deleteEntry] = useMutation(deleteEntryMutation, {
    update(
      cache,
      {
        data: { deleteEntry }
      }
    ) {
      if (deleteEntry.deleted) {
        const { entries } = cache.readQuery({ query: getEntriesQuery });
        cache.writeQuery({
          query: getEntriesQuery,
          data: { entries: entries.filter(entry => entry.id !== original.id) }
        });
      }
    }
  });

  const handleDelete = () => {
    deleteEntry({ variables: { id: original.id } });
  };

  return (
    <button
      className="font-bold text-white text-xs bg-red-500 p-2 focus:outline-none"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}

export default DeleteEntryButton;
