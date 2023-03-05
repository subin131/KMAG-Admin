import React from "react";
import Spinner from "react-bootstrap/Spinner";

function SpinnerButton(props) {
  const style = {
    opacity: "50%",
    cursor: "default",
    width: props.width || "fit-content",
    height: props.height || "40px"
  };

  return (
    <div className="my_font">
      {!props.isSubmitting ? (
        <button className={`btn btn-primary d-flex align-items-center justify-content-center gap-2 ${props.className}`} onClick={props.onClick} style={{width: props.width || "fit-content",height: props.height || "40px"}}>
          {props.title}
        </button>
      ) : (
        <button
          className={`${props.className} btn btn-primary d-flex align-items-center justify-content-center gap-2`}
          style={style}
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          {props.title}
        </button>
      )}
    </div>
  );
}

export default SpinnerButton;
