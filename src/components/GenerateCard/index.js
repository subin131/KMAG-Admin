import { Button } from "react-bootstrap";
import React, { useState } from "react";
import NormalDropdown from "../Dropdown/NormalDropdown";
import { postNewCard } from "../../api/cardApi";
import toastMessage from "../ToastMessage";
import "./GenerateCard.css";

function GenerateCard(props) {
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [error, setError] = useState("");

  //values for dropdown
  const packageValues = [
    { name: "Select Package", option: "" },
    ...props.dropdownPackages,
  ];

  //submit card
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage) {
      setError("Package is required !");
    } else {
      setLoading(true);
      try {
        const data = { packageId: selectedPackage };
        const response = await postNewCard(data);    //api request
        toastMessage({
          type: "success",
          message: "Card generated successfully",
        });
        props.fetchCards();   //recall get card api
      } catch (error) {
        console.log("error", error);
        toastMessage({
          type: "error",
          message: "Card generation failed !",
        });
      }
      setSelectedPackage("");
      setLoading(false);
    }
  };

  return (
    <div className="generate-card">
      <div>
          <h6>Generate Card</h6>
        <label>Select Package:</label>
        <NormalDropdown
          onChange={(option) => {
            setSelectedPackage(option);
            setError("");
          }}
          values={packageValues}
          width={250}
          className="mx-0"
        />

        {error && (
          <div className="error text-danger" style={{ fontSize: "12px" }}>
            {error}
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <Button   className="all-btn" variant="active" disabled>
            Generate
          </Button>
        ) : (
          <Button className="all-btn" variant="active"  onClick={handleSubmit}>
            Generate
          </Button>
        )}
      </div>
    </div>
  );
}

export default GenerateCard;
