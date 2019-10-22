import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import numbro from "numbro";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

const UPDATE_AMOUNT_CENTS_MUTATION = gql`
  mutation UpdateEntryAmountCents($id: ID!, $amountCents: Int!) {
    updateEntry(id: $id, amountCents: $amountCents) {
      entry {
        id
        description
        amountCents
        date
      }
    }
  }
`;

const numberMask = createNumberMask({
  allowDecimal: true,
  decimalLimit: 2,
  allowNegative: true,
  prefix: "$ "
});

function AmountCentsCell({
  cell: { value: initialValue },
  row: {
    original: { id: entryId }
  }
}) {
  const [amountCents, setAmountCents] = useState(initialValue);
  const [updateAmountCents] = useMutation(UPDATE_AMOUNT_CENTS_MUTATION);

  useEffect(() => {
    setAmountCents(initialValue);
  }, [initialValue]);

  const centsInDecimal = Number((amountCents / 100).toFixed(2));

  const handleChange = event => {
    const unformatted = numbro.unformat(event.target.value);
    if (unformatted !== undefined) {
      setAmountCents(Number((unformatted * 100).toFixed(0)));
    } else {
      setAmountCents(0);
    }
  };

  const handleBlur = () => {
    updateAmountCents({ variables: { id: entryId, amountCents } });
  };

  return (
    <MaskedInput
      mask={numberMask}
      value={centsInDecimal}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export default AmountCentsCell;
