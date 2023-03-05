// import { Modal, Button } from "react-bootstrap";
// import React, { useState } from "react";
// import NormalDropdown from "../Dropdown/NormalDropdown";
// import { postNewCard } from "../../api/cardApi";
// import toastMessage from "../ToastMessage";

// function AddCardModal(props) {
//   const [loading, setLoading] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState("");
//   const [error, setError] = useState("");

//   const packageValues = [
//     { name: "Select Package", option: "" },
//     ...props.dropdownPackages,
//   ];

//   const handleCloseModal = () => {
//       props.handleClose();
//       setError("");
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedPackage) {
//       setError("Package is required !");
//     } else {
//       setLoading(true);
//       try {
//         const data = { packageId: selectedPackage };
//         const response = await postNewCard(data);
//         toastMessage({
//           type: "success",
//           message: "Card generated successfully",
//         });
//         props.fetchCards();
//       } catch (error) {
//         console.log("error", error);
//         toastMessage({
//           type: "error",
//           message: "Card generation failed !",
//         });
//       }
//       setLoading(false);
//       handleCloseModal();
//     }
//   };

//   return (
//     <div>
//       <Modal show={props.show} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Generate Card</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="dropdown-body">
//           <div>
//             <label>Select Package:</label>
//               <NormalDropdown
//               onChange={(option) => {
//                 setSelectedPackage(option);
//               }}
//               values={packageValues}
//               width={200}
//               className="mx-0"
//             />  
            
//             {error && <div className="error text-danger" style={{fontSize:"12px"}}>{error}</div>}
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           {loading ? (
//             <Button variant="success" disabled>
//               Generate
//             </Button>
//           ) : (
//             <Button variant="success" onClick={handleSubmit}>
//               Generate
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default AddCardModal;
