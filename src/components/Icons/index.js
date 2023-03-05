import { GoVerified } from "react-icons/go";
import { RiErrorWarningLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { Tooltip } from "antd";

import React from "react";

export function Verified({tip}) {
  return (
    <>
      <Tooltip title={tip || "Verified"}>
        <GoVerified
          className="text-success"
          style={{ fontSize: "18px", marginLeft: "10px" }}
        />
      </Tooltip>
    </>
  );
}

export function NotVerified({tip}) {
  return (
    <>
      <Tooltip title={tip || "Not Verified"}>
        <RiErrorWarningLine
          className="text-danger"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        />
      </Tooltip>
    </>
  );
}

export function CrossIcon() {
  return (
      <AiOutlineClose/>
  );
}