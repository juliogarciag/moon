import React, { useState, useEffect, forwardRef, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import Input from "components/Input";
import { formatDate } from "lib/formatDateAndTime";
import updateDateMutation from "./updateEntryDate.graphql";

const DateCellInput = forwardRef(
  ({ initialValue, entryId, closeCell }, ref) => {
    const [date, setDate] = useState(initialValue);
    const [updateDate] = useMutation(updateDateMutation);

    useEffect(() => {
      setDate(initialValue);
    }, [initialValue]);

    const handleChange = event => {
      setDate(event.target.value);
    };

    const handleEnter = event => {
      if (event.key === "Enter") {
        save();
        closeCell();
      }
    };

    const save = () => updateDate({ variables: { id: entryId, date } });

    const stopPropagation = event => event.stopPropagation();

    return (
      <Input
        type="date"
        className="leading-none"
        ref={ref}
        value={date}
        onChange={handleChange}
        onKeyDown={stopPropagation}
        onKeyPress={handleEnter}
        onBlur={save}
      />
    );
  }
);

function DateCell({
  isOpen,
  closeCell,
  cell: { value },
  row: {
    original: { id: entryId }
  }
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen, inputRef]);

  if (isOpen) {
    return (
      <DateCellInput
        entryId={entryId}
        initialValue={value}
        ref={inputRef}
        closeCell={closeCell}
      />
    );
  } else {
    return <span className="p-2 cursor-default">{formatDate(value)}</span>;
  }
}

export default DateCell;
