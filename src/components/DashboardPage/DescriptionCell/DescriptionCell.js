import React, { useState, useEffect, forwardRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import updateDescriptionMutation from "./updateEntryDescription.graphql";
import Input from "components/Input";

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

  const handleEnter = async event => {
    if (event.key === "Enter") {
      await save();
      focusNext();
    }
  };

  return (
    <Input
      ref={ref}
      value={value}
      onChange={handleChange}
      onKeyPress={handleEnter}
      onBlur={save}
    />
  );
}

export default forwardRef(DescriptionCell);
