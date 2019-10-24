import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import updateAmountCentsMutation from "./updateEntryAmountCents.graphql";
import styles from "./EntriesTable.module.css";

function AmountCentsCell({
  cell: { value: initialValue },
  row: {
    original: { id: entryId }
  }
}) {
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

  const handleBlur = () => {
    updateAmountCents({
      variables: { id: entryId, amountCents: Number(amountInDecimal) * 100 }
    });
  };

  return (
    <input
      className={styles.amountCellInput}
      type="number"
      step="0.01"
      value={amountInDecimal}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export default AmountCentsCell;
