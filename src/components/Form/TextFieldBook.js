import React from "react";

import Label from "../Label";

export function TextFieldBook({ label, ...props }) {
  return (
    <div className="mt-2">
      <Label htmlFor={props.name} title={label} {...props} />
      <div className="d-flex flex-row justify-content-between align-items-center">
        <input
          className={`form-control shadow-none mt-1 `}
          {...props}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

export default TextFieldBook;
