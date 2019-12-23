import React, { useState, useEffect, forwardRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import updateAmountCentsMutation from "./updateEntryAmountCents.graphql";
import Input from "components/Input";

function centsToDecimal(value) {
  return (value / 100).toFixed(2);
}

const AmountCellInput = forwardRef(({ initialValue, entryId }, ref) => {
  const [amountInDecimal, setAmountInDecimal] = useState(() =>
    centsToDecimal(initialValue)
  );
  const [updateAmountCents] = useMutation(updateAmountCentsMutation);

  useEffect(() => {
    setAmountInDecimal(centsToDecimal(initialValue));
  }, [initialValue]);

  const handleChange = event => {
    setAmountInDecimal(event.target.value.toString());
  };

  const handleEnter = async event => {
    if (event.key === "Enter") {
      await save();
    }
  };

  const save = () => {
    updateAmountCents({
      variables: { id: entryId, amountCents: Number(amountInDecimal) * 100 }
    });
  };

  return (
    <Input
      ref={ref}
      type="number"
      step="0.01"
      className="text-right font-mono"
      value={amountInDecimal}
      onChange={handleChange}
      onKeyPress={handleEnter}
      onBlur={save}
    />
  );
});

function AmountCentsCell(
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
    return <AmountCellInput ref={ref} initialValue={value} entryId={entryId} />;
  } else {
    return (
      <span className="text-right font-mono pr-5 mt-2">
        {centsToDecimal(value)}
      </span>
    );
  }
}

export default forwardRef(AmountCentsCell);
