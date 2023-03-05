import React from "react";

function Label({ html, title, mandatory, login, isProfile }) {
  const cssLabel = {
    color: " #7C8492"
  }
  return (
    <label htmlFor={html} className={login && "label-login"}
     style={isProfile && cssLabel}
     >
      {title}{" "}
      {mandatory && (
        <span className="text-danger" style={{ fontSize: "16px" }}>
          *
        </span>
      )}

    </label>
  );
}

export default Label;
