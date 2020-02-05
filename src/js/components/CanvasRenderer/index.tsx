import * as React from "react";
import "./index.scss";

function rangeMap(
  n: number,
  min: number,
  max: number,
  oMin: number,
  oMax: number
) {
  return ((n - min) * (oMax - oMin)) / (max - min) + oMin;
}

const STEP_WIDTH = 1;
const WIDTH_OF_CANVAS = 100;
const X_COMPRESSION = 400;
const PI_2 = Math.PI * 2;

const polarize = (pt: S.Point2D, yStep = 0, xStep = 0) => {
  // const expansionPressure = rangeMap(pt.y, 100, 0, 0, xStep / 2);
  const expansionPressure = 0;

  return {
    x:
      (WIDTH_OF_CANVAS - pt.y + yStep + expansionPressure) *
        Math.cos(((pt.x + xStep) / X_COMPRESSION) * PI_2) +
      100,
    y:
      (WIDTH_OF_CANVAS - pt.y + yStep + expansionPressure) *
        Math.sin(((pt.x + xStep) / X_COMPRESSION) * PI_2) +
      100
  };
};

const CanvasRenderer: React.FC<{
  pathRef: React.MutableRefObject<SVGPathElement>;
  blocks: S.Block[];
  yStep?: number;
  xStep?: number;
  yStepInc?: number;
  xStepInc?: number;
}> = ({
  pathRef,
  blocks,
  yStep = 0,
  xStep = 0,
  yStepInc = Infinity,
  xStepInc = Infinity
}) => {
  const [pathData, setPathData] = React.useState<string>("");

  React.useEffect(() => {
    setPathData(() => {
      let pathUpdate = "";
      let yStepTotal = 0;
      let xStepTotal = 0;
      if (pathRef.current) {
        const r = pathRef.current;
        const length = r.getTotalLength();
        const firstPoint = polarize(r.getPointAtLength(0));
        pathUpdate = `M${firstPoint.x},${firstPoint.y}L`;

        let yInc = 0;
        let xInc = 0;
        for (let i = STEP_WIDTH; i < length; i += STEP_WIDTH) {
          const ptOrtho = r.getPointAtLength(i);
          const pt = polarize(
            {
              x: ptOrtho.x,
              y: ptOrtho.y
            },
            yStepTotal,
            xStepTotal
          );
          pathUpdate += ` ${pt.x},${pt.y}`;
          yInc += STEP_WIDTH;
          xInc += STEP_WIDTH;
          if (yInc > yStepInc) {
            yInc = 0;
            yStepTotal += yStep;
          }
          if (xInc > xStepInc) {
            xInc = 0;
            xStepTotal += xStep;
          }
        }
        const ptOrtho = r.getPointAtLength(length);
        const lastPoint = polarize(
          {
            x: ptOrtho.x,
            y: ptOrtho.y
          },
          yStepTotal,
          xStepTotal
        );
        pathUpdate += ` ${lastPoint.x},${lastPoint.y}`;
      }
      return pathUpdate;
    });
  }, [blocks]);

  return (
    <div id="canvas-renderer">
      <svg
        width={800}
        height={800}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          fill={"rgba(0, 0, 0, .1)"}
          stroke={"transparent"}
          cx={"100"}
          cy={"100"}
          r={"100"}
        />
        <path
          stroke={"black"}
          fill={"transparent"}
          strokeWidth={0.5}
          d={pathData}
        />
      </svg>
    </div>
  );
};

export default CanvasRenderer;
