import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const UPDATE_DESCRIPTION_MUTATION = gql`
  mutation UpdateEntryDescription($id: ID!, $description: String!) {
    updateEntry(id: $id, description: $description) {
      entry {
        id
        description
        amountCents
        date
      }
    }
  }
`;

function DescriptionCell({
  cell: { value: initialValue },
  row: {
    original: { id: entryId }
  }
}) {
  const [value, setValue] = useState(initialValue);
  const [updateDescription] = useMutation(UPDATE_DESCRIPTION_MUTATION);

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
