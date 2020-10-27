import React, { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import { isEmpty } from "../utils";

const AddUserModal = ({ onSave }) => {
  const [formState, setFormState] = useState("initial");
  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState(undefined);
  const [show, setShow] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  const isImageValid = !isEmpty(image);
  const isFullNameValid = !isEmpty(fullName);
  const isFormValid = isImageValid && isFullNameValid;

  const processImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImage(reader.result.split(",")[1]);
    reader.onerror = () => setFormState("error");
  };

  const submitForm = (e) => {
    setSubmitClicked(true);
    if (isFormValid) {
      setFormState("saving");
      e.preventDefault();
      onSave({ fullName, image })
        .then(() => setFormState("saved"))
        .catch(() => setFormState("error"));
    }
  };

  const toggle = (reset) => {
    setShow(!show);
    if (reset) {
      setFormState("initial");
      setFullName("");
      setImage(undefined);
    }
  };

  const validationAttributes = (isValid) =>
    !submitClicked ? {} : isValid ? { isValid: true } : { isInvalid: true };

  return (
    <>
      <Button onClick={() => toggle(true)} size="sm">
        Add a new user
      </Button>
      <Modal show={show} onHide={toggle}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            By uploading a picture and associating it with a name, Amazon
            Rekognition can recognize that person.
          </p>
          <hr />
          <Alert
            variant="warning"
            style={{
              display: formState === "saving" ? "block" : "none",
            }}
          >
            Please wait
          </Alert>
          <Alert
            variant="danger"
            style={{
              display: formState === "error" ? "block" : "none",
            }}
          >
            An error happened. Retry.
          </Alert>
          <Alert
            variant="success"
            style={{
              display: formState === "saved" ? "block" : "none",
            }}
          >
            The user has been added.
          </Alert>
          <form
            style={{
              display: formState === "initial" ? "block" : "none",
            }}
          >
            <Form.Group controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name e.g. Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                {...validationAttributes(isFullNameValid)}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>User Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => processImage(e.target.files[0])}
                {...validationAttributes(isImageValid)}
              />
            </Form.Group>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={submitForm}
            variant="primary"
            type="submit"
            disabled={!fullName || !image || formState !== "initial"}
            show="false"
          >
            Add User
          </Button>
          <Button onClick={toggle}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddUserModal;
