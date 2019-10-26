import React, { useState, useEffect, forwardRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import updateDescriptionMutation from "./updateEntryDescription.graphql";
import styles from "./EntriesTable.module.css";

function DescriptionCell(
  {
    cell: { value: initialValue },
    row: {
      original: { id: entryId }
    },
    focusNext
  },
  ref
) {
  const [value, setValue] = useState(initialValue);
  const [updateDescription] = useMutation(updateDescriptionMutation);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = e => {
    setValue(e.target.value);
  };

  const save = () =>
    updateDescription({ variables: { id: entryId, description: value } });

  const handleSubmit = event => {
    event.preventDefault();
    focusNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={ref}
        className={styles.descriptionCellInput}
        value={value}
        onChange={handleChange}
        onBlur={save}
      />
    </form>
  );
}

export default forwardRef(DescriptionCell);
