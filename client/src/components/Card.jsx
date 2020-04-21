import React from "react";
import { Card, Alert, ButtonGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default (props) => {
  const {
    id,
    OwnerId,
    area,
    address,
    coordinate,
    Rooms,
    image
  } = props.building;

  return (
    <>
      <div className="col-3 mb-2 ">
        <Link key={id} to={`/building/${id}`} className="btn">
          <Card className="customeHover">
            <Card.Img variant="top" src={image} />
            <Card.Body>
              <Card.Title>
                Koi Residence
              </Card.Title>
              <div className="my-1">
                <h6>{area}</h6>
                <em>{address}</em>
                {
                  Rooms
                  ? <Alert variant="success" style={{padding: "0px", marginTop: "5px"}}>Available {Rooms.length} rooms</Alert>
                  : <Alert variant="success" style={{padding: "0px", marginTop: "5px"}}>No room available</Alert>
                }
              </div>
            </Card.Body>
          </Card>
        </Link>
      </div>
    </>
  );
};
