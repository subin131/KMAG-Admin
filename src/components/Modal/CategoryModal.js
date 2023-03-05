import { Button, Modal } from "react-bootstrap";

import React from "react";

export function CategoryModal(props) {
  return (
    <div>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="mb-2">Category Name</label>
          <input
            type="text"
            className="form-control shadow-none"
            value={props.value}
            onChange={props.onChange}
          />
          {props.errorName && (
            <p className="error text-danger" style={{fontSize:"12px"}}>{props.errorName}</p>
          )}

          <label className="mb-2 mt-3">Category Description</label>
          <textarea
            type="text"
            rows={4}
            className="form-control shadow-none"
            value={props.descValue}
            onChange={props.onDescChange}
          />
          {props.errorDesc && (
            <p className="error text-danger" style={{fontSize:"12px"}}>{props.errorDesc}</p>
          )}

          <label className="mb-2 mt-3">Category Rank {props.title==="Add Category" && <span className="opacity-50">(Optional)</span>} </label>
          <input
            type="number"
            className="form-control shadow-none"
            value={props.rank}
            onChange={props.handleRankChange}
          />
          {props.errorRank && (
            <p className="error text-danger" style={{fontSize:"12px"}}>{props.errorRank}</p>
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
