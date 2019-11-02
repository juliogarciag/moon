import { memoizeWith, identity } from "ramda";

const DEFAULT_LOCALE = "en-us";

const getLocalizedMonth = memoizeWith(identity, index => {
  const objDate = new Date();
  objDate.setDate(1);
  objDate.setMonth(index);
  return objDate.toLocaleString(DEFAULT_LOCALE, { month: "long" });
});

export default getLocalizedMonth;
