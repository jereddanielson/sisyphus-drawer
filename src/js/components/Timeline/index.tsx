import * as React from "react";

type Props = {
  path: string;
};

export const Timeline: React.FC<Props> = ({ path }) => {
  return (
    <svg
      id="timeline"
      width={800}
      height={200}
      viewBox="0 0 400 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="pattern-checkers"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <rect fill="rgba(0, 0, 0, .1)" x="0" width="10" height="10" y="0" />
          <rect fill="rgba(0, 0, 0, .1)" x="10" width="10" height="10" y="10" />
        </pattern>
      </defs>
      <rect width="400" height="100" fill="url(#pattern-checkers)" />
      <path stroke={"black"} fill={"transparent"} d={path} />
    </svg>
  );
};
