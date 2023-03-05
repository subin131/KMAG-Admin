//built-in
import React, { useState } from "react";
import { Formik, Form } from "formik";

//custom
import "./Login.css";
import { TextField } from "../../components/Form/TextField";
import { loginValidation } from "../../validation/loginValidation";
import { useAuth } from "../../auth/useAuth";
import { loginUser } from "../../api/userApi";
import toastMessage from "../../components/ToastMessage";
import Navbar1 from "../../components/Navbar";
import SpinnerButton from "../../components/Button/SpinnerButton";

export default function Login() {
  const auth = useAuth();
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (values) => {
    setIsSubmitting(true);
    try {
      const data = {
        body: { email: values.email, password: values.password },
        keepAlive: remember ? "true" : "false",
      };
      const response = await loginUser(data);
      auth.login(response?.data?.data?.user);
    } catch (error) {
      toastMessage({
        type: "error",
        message: error?.response?.data?.data || "Something went wrong",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <Navbar1 />
      <div className="body">
        <div className="form">
          <h2 className="adminlogin-title">Login</h2>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidation}
            onSubmit={(values) => handleLogin(values)}
          >
            {({ formik }) => (
              <Form>
                <div>
                  <TextField
                    type={"text"}
                    name={"email"}
                    label={"Email"}
                    login={"true"}
                  />
                  <TextField
                    type={"password"}
                    name={"password"}
                    label={"Password"}
                    login={"true"}
                  />
                  <div
                    className="mt-2 d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      value={remember}
                      onChange={() => setRemember(!remember)}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="label-login"
                      htmlFor="remember"
                      style={{ cursor: "pointer", paddingLeft: "5px" }}
                    >
                      Remember me
                    </label>
                  </div>

                  <SpinnerButton
                    type="submit"
                    title="Log in"
                    isSubmitting={isSubmitting}
                    className="btn btn-danger login-button mt-2"
                    width={"100%"}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
