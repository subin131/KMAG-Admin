import React, { useState } from 'react'
import { Card, Row, Col, Container } from 'react-bootstrap';
import "./card.css"

function CardLayout(props) {

  return (
    <div>
    
    
      <Card style={{ width: '25rem', backgroundColor: props.color }}>
        <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white" }}>
    
          <Card.Text style={{ fontSize: "30px" ,margin:"5px"}}>
            {props.icon}
          </Card.Text>
          <Card.Title style={{ fontSize: "30px", display: "flex", alignItems: "center" }}> {props.title}</Card.Title>
          
          <Card.Text style={{ fontSize: "25px" }}>
            {props.value}
          </Card.Text>
          <Container style={{ width: "23rem" }}>
            <Row  >
              <Col className="column-data">
                <p>{props.subTitle1}</p>
                <h4>{props.subValue1}</h4>
              </Col>
              <Col className="column-data">
                <p>{props.subTitle2}</p>
                <h4>{props.subValue2}</h4>
              </Col>
              <Col className="column-data">
                <p>{props.subTitle3}</p>
                <h4>{props.subValue3}</h4>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  )
}


export default CardLayout
