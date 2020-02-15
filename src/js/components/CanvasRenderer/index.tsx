import * as React from "react";
import "./index.scss";

const worker = new Worker("w.tsx");

export const CanvasRenderer: React.FC<{
  path: string;
  yStep?: number;
  xStep?: number;
  yStepInc?: number;
  xStepInc?: number;
  stepWidth?: number;
}> = ({
  path = "",
  yStep = 0,
  xStep = 0,
  yStepInc = Infinity,
  xStepInc = Infinity,
  stepWidth = 5
}) => {
  const [pathData, setPathData] = React.useState<string>("");
  const [workerState, setWorkerState] = React.useState<string>("Done");

  React.useEffect(() => {
    worker.onmessage = ({ data }) => {
      setWorkerState(data.status);
      data.path && setPathData(data.path);
    };

    worker.postMessage({
      pathData: path,
      xStep,
      yStep,
      xStepInc,
      yStepInc,
      stepWidth: Math.max(stepWidth, 0.1)
    });
    setWorkerState("0%");
  }, [path, xStep, yStep, xStepInc, yStepInc, stepWidth]);

  return (
    <svg
      id="canvas-renderer"
      width={800}
      height={800}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="monospace"
    >
      <text x="0" y="10" fontSize="6">
        Render: {workerState}
      </text>
      <circle fill={"#bcb5a7"} cx={"100"} cy={"100"} r={"100"} />
      <path
        stroke={"black"}
        fill={"transparent"}
        strokeWidth={0.5}
        d={pathData}
      />
    </svg>
  );
};
