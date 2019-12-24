import React, { useState, useEffect, forwardRef, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import updateDescriptionMutation from "./updateEntryDescription.graphql";
import Input from "components/Input";

const DescriptionCellInput = forwardRef(
  ({ initialValue, entryId, isNew }, ref) => {
    const [value, setValue] = useState(initialValue);
    const [updateDescription] = useMutation(updateDescriptionMutation);

    const save = () =>
      updateDescription({ variables: { id: entryId, description: value } });

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    const handleChange = event => {
      setValue(event.target.value);
    };

    const handleEnter = async event => {
      if (event.key === "Enter") {
        await save();
      }
    };

    return (
      <Input
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyPress={handleEnter}
        onBlur={save}
        placeholder={isNew ? "New Entry" : null}
      />
    );
  }
);

function DescriptionCell({
  isOpen,
  cell: { value },
  row: {
    original: { id: entryId, isNew }
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
      <DescriptionCellInput
        entryId={entryId}
        initialValue={value}
        isNew={isNew}
        ref={inputRef}
      />
    );
  } else {
    return <span className="p-2 cursor-default">{value}</span>;
  }
}

export default DescriptionCell;
