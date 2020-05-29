import React from "react";
import { Card } from "react-bootstrap";

import Icon from "./Icon";

export default ({ testResults }) => (
  <div className="tests-container">
    {testResults.map((test, index) => (
      <Card style={{ marginTop: "20px", textAlign: "left" }} key={index}>
        <Card.Header>
          <Icon type={test.Success ? "success" : "fail"} />
          {test.TestName}
        </Card.Header>
        <Card.Body>
          <Card.Text>{test.Details}</Card.Text>
        </Card.Body>
      </Card>
    ))}
  </div>
);
