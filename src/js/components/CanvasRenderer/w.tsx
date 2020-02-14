import "regenerator-runtime/runtime";

import { svgPathProperties } from "svg-path-properties";

self.onmessage = ({ data }) => {
  const {
    pathData,
    xStep,
    yStep,
    xStepInc,
    yStepInc,
    stepWidth,
    canvasWidth = 100,
    xCompression = 200
  } = data;
  const svg = new svgPathProperties(pathData);
  const PI_2 = Math.PI * 2;

  const polarize = (pt: S.Point2D, yStep = 0, xStep = 0) => {
    // const expansionPressure = rangeMap(pt.y, 100, 0, 0, xStep / 2);
    const expansionPressure = 0;

    return {
      x:
        (canvasWidth - pt.y + yStep + expansionPressure) *
          Math.cos(((pt.x + xStep) / xCompression) * PI_2) +
        100,
      y:
        (canvasWidth - pt.y + yStep + expansionPressure) *
          Math.sin(((pt.x + xStep) / xCompression) * PI_2) +
        100
    };
  };

  let pathUpdate = "";
  let yStepTotal = 0;
  let xStepTotal = 0;
  const length = svg.getTotalLength();

  if (length === 0) {
    self.postMessage({ status: "Done", path: "" });
    return;
  }

  const firstPoint = polarize(svg.getPointAtLength(0));
  pathUpdate = `M${firstPoint.x},${firstPoint.y}L`;

  let yInc = 0;
  let xInc = 0;
  const progress25 = false;
  const progress50 = false;
  const progress75 = false;
  for (let i = stepWidth; i < length; i += stepWidth) {
    const ptOrtho = svg.getPointAtLength(i);
    const pt = polarize(
      {
        x: ptOrtho.x,
        y: ptOrtho.y
      },
      yStepTotal,
      xStepTotal
    );
    pathUpdate += ` ${pt.x},${pt.y}`;
    yInc += stepWidth;
    xInc += stepWidth;
    if (yInc > yStepInc) {
      yInc = 0;
      yStepTotal += yStep;
    }
    if (xInc > xStepInc) {
      xInc = 0;
      xStepTotal += xStep;
    }

    if (!progress25 && i >= length * 0.25) {
      progress25 = true;
      self.postMessage({ status: "25%", path: pathUpdate });
    } else if (!progress50 && i >= length * 0.5) {
      progress50 = true;
      self.postMessage({ status: "50%", path: pathUpdate });
    } else if (!progress75 && i >= length * 0.75) {
      progress75 = true;
      self.postMessage({ status: "75%", path: pathUpdate });
    }
  }
  const ptOrtho = svg.getPointAtLength(length);
  const lastPoint = polarize(
    {
      x: ptOrtho.x,
      y: ptOrtho.y
    },
    yStepTotal,
    xStepTotal
  );
  pathUpdate += ` ${lastPoint.x},${lastPoint.y}`;
  self.postMessage({ status: "Done", path: pathUpdate });
};
