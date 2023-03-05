import * as yup from 'yup';

export const loginValidation = yup.object({
    email: yup.string().email('Invalid Email').required('Email is required !'),
    password:yup.string().matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,"Invalid Password").required('Password is required !')
  })