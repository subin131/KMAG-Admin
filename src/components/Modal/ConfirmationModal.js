import Modal from "react-bootstrap/Modal";
import SpinnerButton from "../Button/SpinnerButton";

export function ConfirmationModal(props) {
  const handleCloseModal = () => {
    if(!props.isSubmitting){
      props.handleClose();
    }
  }
  return (
    <Modal
      show={props.show}
      onHide={handleCloseModal}
      className="my_font"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.message || "Are you sure?"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-around">
          <SpinnerButton 
          title={props.delete ? "Delete" : "Yes"}
          isSubmitting={props.isSubmitting}
          className={`btn ${props.delete ? "btn-danger" : "btn-primary px-4"}`}
          onClick={props.onConfirm}
          />
          {!props.isSubmitting ? (
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
          ) : (
              <button className="btn btn-secondary disabled">
                Cancel
              </button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

