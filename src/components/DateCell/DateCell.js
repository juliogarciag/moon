import React, { useState, useEffect, forwardRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import Input from "components/Input";
import { formatDate } from "lib/formatDateAndTime";
import updateDateMutation from "./updateEntryDate.graphql";

const DateCellInput = forwardRef(({ initialValue, entryId }, ref) => {
  const [date, setDate] = useState(initialValue);
  const [updateDate] = useMutation(updateDateMutation);

  useEffect(() => {
    setDate(initialValue);
  }, [initialValue]);

  const handleChange = event => {
    setDate(event.target.value);
  };

  const handleEnter = async event => {
    if (event.key === "Enter") {
      await save();
    }
  };

  const save = () => updateDate({ variables: { id: entryId, date } });

  return (
    <Input
      type="date"
      className="leading-none"
      ref={ref}
      value={date}
      onChange={handleChange}
      onKeyPress={handleEnter}
      onBlur={save}
    />
  );
});

function DateCell(
  {
    isOpen,
    cell: { value },
    row: {
      original: { id: entryId }
    }
  },
  ref
) {
  if (isOpen) {
    return <DateCellInput entryId={entryId} initialValue={value} ref={ref} />;
  } else {
    return <span className="p-2">{formatDate(value)}</span>;
  }
}

export default forwardRef(DateCell);
