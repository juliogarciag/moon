import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { Trash2 } from "react-feather";
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
    <button onClick={handleDelete} className="mr-1">
      <Trash2 size={18} />
    </button>
  );
}

export default DeleteEntryButton;
