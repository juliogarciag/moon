import React, { forwardRef } from "react";
import classNames from "classnames";

function Input({ className = "", ...props }, ref) {
  const defaultClassNames =
    "w-full font-mono text-sm p-2 border-0 border-l-2 border-r-2 border-solid border-transparent outline-none focus:border-black focus:bg-yellow-200";

  return (
    <input
      {...props}
      ref={ref}
      className={classNames(defaultClassNames, className)}
    />
  );
}

export default forwardRef(Input);
