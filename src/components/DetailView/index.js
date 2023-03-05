import React from "react";


//users information format
export function DetailView({title,value}) {
  return (
    <div className="row mb-2">
      <div className="col">
        <h6>{title} :</h6>
      </div>
      <div className="col">{value}</div>
    </div>
  );
}
