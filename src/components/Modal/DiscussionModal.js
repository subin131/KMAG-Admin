import { Button, Modal } from "react-bootstrap";

import React, { useState } from "react";
import { InputDropdown } from "../Dropdown/InputDropdown";

export function DiscussionModal(props) {
  const [selectedCategoryId , setSelectedCategoryId] = useState("");
  const [categoryData , setCategoryData] = useState([]);
  const [loading , setLoading] = useState(false)


  return (
    <div>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="mb-2">Question Title</label>
          <input
            type="text"
            className="form-control shadow-none"
            value={props.value}
            onChange={props.onChange}
          />
          {props.errorName && (
            <p className="error text-danger">{props.errorName}</p>
          )}

          {/* <InputDropdown
          onChange={(option) => {
            setSelectedCategoryId(option);
          }}
          values={categoryValues}
          /> */}

          <label className="mb-2 mt-3">Question Description</label>
          <textarea
            type="text"
            rows={4}
            className="form-control shadow-none"
            value={props.descValue}
            onChange={props.onDescChange}
          />
          {props.errorDesc && (
            <p className="error text-danger">{props.errorDesc}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {props.loading ? (
            <Button variant="success" disabled>
              Save Changes
            </Button>
          ) : (
            <Button variant="success" onClick={props.handleSubmit}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}