import React from "react";

import Icon from "./Icon";

export default ({ testResults }) => (
  <div className="p-2">
    {testResults.map((test, index) => (
      <p className="text-justify p-1" key={index}>
        <Icon type={test.Success ? "success" : "fail"} />
        {test.TestName}
        {test.Details && ` (${test.Details})`}
      </p>
    ))}
  </div>
);
