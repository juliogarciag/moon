import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import updateDescriptionMutation from "./updateEntryDescription.graphql";

function DescriptionCell({
  cell: { value: initialValue },
  row: {
    original: { id: entryId }
  }
}) {
  const [value, setValue] = useState(initialValue);
  const [updateDescription] = useMutation(updateDescriptionMutation);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    updateDescription({ variables: { id: entryId, description: value } });
  };

  return <input value={value} onChange={handleChange} onBlur={handleBlur} />;
}

export default DescriptionCell;
