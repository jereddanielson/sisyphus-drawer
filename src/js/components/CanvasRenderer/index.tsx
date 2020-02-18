import * as React from "react";
import "./index.scss";

const worker = new Worker("w.tsx");

type Props = {
  path: string;
  yStep?: number;
  xStep?: number;
  yStepInc?: number;
  xStepInc?: number;
  stepWidth?: number;
};

export const CanvasRenderer: React.FC<Props> = props => {
  const {
    path = "",
    yStep = 0,
    xStep = 0,
    yStepInc = Infinity,
    xStepInc = Infinity,
    stepWidth = 5
  } = props;
  const [pathData, setPathData] = React.useState<string>("");
  const [workerState, setWorkerState] = React.useState<string>("Done");
  const [renderQueue, setRenderQueue] = React.useState<
    Array<{ task: Props; currentStepWidth: number }>
  >([]);

  // Listen for changes to props and generate render queue
  React.useEffect(() => {
    setRenderQueue([
      { task: { ...props }, currentStepWidth: stepWidth },
      { task: { ...props }, currentStepWidth: stepWidth * 2 },
      { task: { ...props }, currentStepWidth: stepWidth * 4 }
    ]);
  }, [props, stepWidth]);

  // Render function
  const doRender = React.useCallback(
    (task: Props, currentStepWidth: number) => {
      setWorkerState("Working");

      worker.onmessage = ({ data }) => {
        setWorkerState(data.status);
        setPathData(data.path);
      };

      worker.postMessage({
        ...task,
        pathData: task.path,
        stepWidth: Math.max(currentStepWidth, 0.1)
      });
    },
    []
  );

  // When worker is ready and there are items to render, do so
  React.useEffect(() => {
    if (workerState === "Done" && renderQueue.length > 0) {
      setRenderQueue(oldRenderQueue => {
        const newRenderQueue = [...oldRenderQueue];
        const { task, currentStepWidth } = newRenderQueue.pop();
        doRender(task, currentStepWidth);
        return newRenderQueue;
      });
    }
  }, [workerState, renderQueue, doRender]);

  return (
    <svg
      id="canvas-renderer"
      width={800}
      height={800}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="monospace"
    >
      <text x="0" y="10" fontSize="5">
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
