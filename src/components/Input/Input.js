import React, { forwardRef } from "react";
import classNames from "classnames";

function Input({ className = "", ...props }, ref) {
  const defaultClassNames = "w-full text-sm p-2 bg-transparent";

  return (
    <input
      {...props}
      ref={ref}
      className={classNames(defaultClassNames, className)}
    />
  );
}

export default forwardRef(Input);
