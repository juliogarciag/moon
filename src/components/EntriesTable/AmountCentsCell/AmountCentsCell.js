import React, { useState, useEffect, forwardRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import updateAmountCentsMutation from "./updateEntryAmountCents.graphql";
import Input from "components/Input";

function AmountCentsCell(
  {
    cell: { value: initialValue },
    row: {
      original: { id: entryId }
    },
    focusNext
  },
  ref
) {
  const [amountInDecimal, setAmountInDecimal] = useState(() =>
    (initialValue / 100).toFixed(2)
  );
  const [updateAmountCents] = useMutation(updateAmountCentsMutation);

  useEffect(() => {
    setAmountInDecimal((initialValue / 100).toFixed(2));
  }, [initialValue]);

  const handleChange = event => {
    setAmountInDecimal(event.target.value.toString());
  };

  const handleSubmit = () => {
    event.preventDefault();
    focusNext();
  };

  const save = () => {
    updateAmountCents({
      variables: { id: entryId, amountCents: Number(amountInDecimal) * 100 }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        ref={ref}
        type="number"
        step="0.01"
        className="text-right"
        value={amountInDecimal}
        onChange={handleChange}
        onBlur={save}
      />
    </form>
  );
}

export default forwardRef(AmountCentsCell);
