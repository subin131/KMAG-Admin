import React from "react";
import { Navbar, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './LoginHeader.css'

function Navbar1() {
  return (
    <div>
      <Navbar className="admin-nav">
        <Container>
          <Navbar.Brand href="#">
          <a href="https://www.kmagz.com/" target ="_blank"><img src="img/kmag.png" width="100" height="100" className="brand-logo" alt=""/></a>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Brand href="#">
            <a href="https://app.kmagz.com/" target ="_blank">App</a>
            </Navbar.Brand>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navbar1;
