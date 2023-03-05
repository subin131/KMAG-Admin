// built-in modules
import React, { useEffect, useState } from "react";

// custom modules
import Packages from "./Packages";
import Subscriptions from "./Subscriptions";

function Subscription() {
  const [selectedOption, setSelectedOption] = useState("subscriptions");

  const changeOption = (e) => {
    e.preventDefault();
    selectedOption === "packages"
      ? setSelectedOption("subscriptions")
      : setSelectedOption("packages");
  };  

  return (
    <div>
      <div className="d-flex flex-direction-row justify-content-between mx-2">
        <h3>{selectedOption === "packages" ? "Packages" : "Subscriptions"}</h3>
        <button className="btn  mb-2 all-btn" onClick={changeOption}>
          View {selectedOption === "packages" ? "Subscriptions" : "Packages"}
        </button>
      </div>
      {selectedOption === "packages" ? <Packages /> : <Subscriptions />}
    </div>
  );
}

export default Subscription;
