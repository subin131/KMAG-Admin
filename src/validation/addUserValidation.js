import * as yup from "yup";

export const addUserValidation = yup.object({
  email: yup.string().email("email is invalid").required("email is required"),
  password: yup
    .string()
    .min(6, "must contain atleast 6 characters")
    .required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password doesnot match"),
});
