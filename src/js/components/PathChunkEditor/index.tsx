import * as React from "react";

import "./index.scss";

type Props = {
  path: string;
};

export const PathChunkEditor: React.FC<Props> = ({ path }) => {
  return (
    <svg className="path-chunk-editor" viewBox="0 0 20 20">
      <rect
        x={0}
        y={0}
        width={100}
        height={100}
        fill={"rgba(0, 0, 0, .2)"}
      ></rect>
      <path d={path} fill={"transparent"} stroke={"black"} strokeWidth={0.5} />
    </svg>
  );
};
