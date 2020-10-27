import React from "react";

const Icon = ({ type, size }) => {
  size = size || "16";

  const SVGWrapper = ({ children }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      focusable="false"
      aria-hidden="true"
      width={size}
      height={size}
    >
      {children}
    </svg>
  );

  if (type === "fail")
    return (
      <SVGWrapper size={size}>
        <circle
          className="stroke-linejoin-round"
          cx="8"
          cy="8"
          r="7"
          stroke="#d13212"
          fill="none"
          strokeWidth="2px"
        />
        <path
          d="M10.828 5.172l-5.656 5.656M10.828 10.828L5.172 5.172"
          stroke="#d13212"
          fill="none"
          strokeWidth="2px"
        />
      </SVGWrapper>
    );

  if (type === "success")
    return (
      <SVGWrapper>
        <circle
          className="stroke-linejoin-round"
          cx="8"
          cy="8"
          r="7"
          stroke="#1d8102"
          fill="none"
          strokeWidth="2px"
        />
        <path
          className="stroke-linecap-square"
          d="M5 8l2 2 3.521-3.521"
          stroke="#1d8102"
          fill="none"
          strokeWidth="2px"
        />
      </SVGWrapper>
    );

  return "";
};

export default Icon;
