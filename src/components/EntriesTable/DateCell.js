import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useMutation } from "@apollo/react-hooks";
import "react-datepicker/dist/react-datepicker.css";
import updateDateMutation from "./updateEntryDate.graphql";
import styles from "./EntriesTable.module.css";

function DateCell({
  cell: { value: initialValue },
  row: {
    original: { id: entryId }
  }
}) {
  const [date, setDate] = useState(() => new Date(initialValue));
  const [updateDate] = useMutation(updateDateMutation);

  useEffect(() => {
    setDate(new Date(initialValue));
  }, [initialValue]);

  const handleBlur = () => {
    updateDate({ variables: { id: entryId, date: date.toISOString() } });
  };

  return (
    <DatePicker
      className={styles.dateCellInput}
      selected={date}
      onChange={setDate}
      onBlur={handleBlur}
    />
  );
}

export default DateCell;
