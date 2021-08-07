import React from 'react'
import { Modal, Button } from 'react-bootstrap'
function Alert(props) {

  return (
      <Modal show={props.show} onHide={props.onClose} dialogClassName="alert">
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.desc}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default Alert