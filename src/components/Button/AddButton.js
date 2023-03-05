import { Button } from 'react-bootstrap'
import React from 'react'
import "./Button.css"

//component for button
function AddButton(props) {
  return (
    <Button variant="active"  onClick={props.handleShow} className="mb-2 all-btn">
      {props.title}
    </Button>
  )
}

export default AddButton

