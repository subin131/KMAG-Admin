import { Formik , Form } from "formik";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { addUser } from "../../api/userApi";
import toastMessage from "../ToastMessage";
import { TextField } from "../Form/TextField";
import { addUserValidation } from "../../validation/addUserValidation";

export default function AddUserModal(props) {
  const [loading, setLoading] = useState(false);
  const handleLogin = async (values) => {
    setLoading(true);    
    try {
      const data = { email: values.email, password: values.password };
      const response = await addUser(data);   //api request
      props.fetchUser();
      toastMessage({
        type: "success",
        message: "User added successfully",
      });
    } catch (error) {
      console.log("error", error);
      toastMessage({
        type: "success",
        message: "Failed to add User !",
      });
    }
    setLoading(false);
    props.handleClose();
  };
  return (
    <div>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={addUserValidation}
            onSubmit={(values) => handleLogin(values)}
          >
            {(formik) => (
              <Form>
                <div>
                  <TextField
                    type={"text"}
                    name={"email"}
                    label={"Email"}
                    mandatory={"true"}
                  />
                  <TextField
                    type={"password"}
                    name={"password"}
                    label={"Password"}
                    mandatory={"true"}
                  />
                  <TextField
                    type={"password"}
                    name={"confirmPassword"}
                    label={"Confirm Password"}
                    mandatory={"true"}
                  />
                  <div className="mt-2">
                    {loading ? (
                  <button className="btn btn-success" disabled>
                    Save Changes
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                )}
                  </div>
                  
                </div>
                
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}
