import React, { useState, useEffect, forwardRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import updateDateMutation from "./updateEntryDate.graphql";
import styles from "./EntriesTable.module.css";

function DateCell(
  {
    cell: { value: initialValue },
    row: {
      original: { id: entryId }
    },
    focusNext
  },
  ref
) {
  const [date, setDate] = useState(initialValue);
  const [updateDate] = useMutation(updateDateMutation);

  useEffect(() => {
    setDate(initialValue);
  }, [initialValue]);

  const save = () => updateDate({ variables: { id: entryId, date } });

  const handleChange = event => {
    setDate(event.target.value);
  };

  const handleEnter = event => {
    if (event.key === "Enter") {
      save();
      focusNext();
    }
  };

  return (
    <input
      type="date"
      ref={ref}
      value={date}
      onChange={handleChange}
      onKeyPress={handleEnter}
      onBlur={save}
      className={styles.dateCellInput}
    />
  );
}

export default forwardRef(DateCell);
