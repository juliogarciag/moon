import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import "react-datepicker/dist/react-datepicker.css";

const UPDATE_DATE_MUTATION = gql`
  mutation UpdateEntryDate($id: ID!, $date: ISO8601Date!) {
    updateEntry(id: $id, date: $date) {
      entry {
        id
        description
        amountCents
        date
      }
    }
  }
`;

function DateCell({
  cell: { value: initialValue },
  row: {
    original: { id: entryId }
  }
}) {
  const [date, setDate] = useState(() => new Date(initialValue));
  const [updateDate] = useMutation(UPDATE_DATE_MUTATION);

  useEffect(() => {
    setDate(new Date(initialValue));
  }, [initialValue]);

  const handleBlur = () => {
    updateDate({ variables: { id: entryId, date: date.toISOString() } });
  };

  return <DatePicker selected={date} onChange={setDate} onBlur={handleBlur} />;
}

export default DateCell;
