import React from "react";
import { ErrorMessage, useField } from "formik";
import Label from "../Label";

export function TextField({ label, profile, ...props }) {
  const [field, meta] = useField(props);
  const cssTextField = {
    background: "transparent",
    color: "white",
    border:"0.5px solid #7C8492",
  }


  return(
    <div className = "mt-2" >
      <Label htmlFor={field.name} title={label} isProfile={profile} {...props}/>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <input
        className={`form-control shadow-none mt-1 ${
          meta.touched && meta.error && "is-invalid"
          
        }`}
 
        {...field}
        {...props}
        autoComplete="off"
        style={profile && cssTextField}
       
      />
      </div>
      
      
      <ErrorMessage
        component="div"
        name={field.name}
        style={{ color: "red", fontSize: "12px" }}
      />
    </div>
  );
}

export default TextField