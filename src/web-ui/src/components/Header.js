import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";

import { retryWrapper } from "../utils";

import AddUserModal from "./AddUserModal";
import RekognitionButton from "./RekognitionButton";

import "./Header.css";

const Header = ({ addUser, readyToStream, signedIn, toggleRekognition }) => {
  const [authError, setAuthError] = useState(null);
  const [userEmail, setUserEmail] = useState(undefined);

  const reload = () => window.location.reload();

  const signOut = () => Auth.signOut().then(reload).catch(reload);

  useEffect(() => {
    if (signedIn) {
      retryWrapper(() => Auth.currentAuthenticatedUser())
        .then((user) => setUserEmail(user.username))
        .catch(setAuthError);
    }
  }, [signedIn]);

  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand>
        <div className="awslogo" />
      </Navbar.Brand>
      <Navbar.Toggle />
      {(userEmail || authError) && (
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {authError && (
              <>
                <span className="auth-error">
                  Authentication error: {authError}
                </span>
                <Button variant="link" className="headerLink" onClick={reload}>
                  Retry
                </Button>
              </>
            )}
            {userEmail && (
              <>
                <RekognitionButton
                  onClick={toggleRekognition}
                  enabled={readyToStream}
                />
                <AddUserModal onSave={addUser} />
                <Button onClick={signOut} variant="warning" size="sm">
                  Sign Out
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
};

export default Header;
