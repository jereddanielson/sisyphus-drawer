import "regenerator-runtime/runtime";

import { JSDOM } from "jsdom";
const dom = new JSDOM("<!DOCTYPE html></html>");

self.onmessage = ({ data }) => {
  const { pathData, xStep, yStep, xStepInc, yStepInc } = data;
  const svg = dom.window.document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  svg.setAttributeNS(null, "d", pathData);

  const STEP_WIDTH = 5;
  const WIDTH_OF_CANVAS = 100;
  const X_COMPRESSION = 200;
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

  let pathUpdate = "";
  let yStepTotal = 0;
  let xStepTotal = 0;
  console.log(svg);
  const length = svg.getTotalLength();
  const firstPoint = polarize(svg.getPointAtLength(0));
  pathUpdate = `M${firstPoint.x},${firstPoint.y}L`;

  let yInc = 0;
  let xInc = 0;
  for (let i = STEP_WIDTH; i < length; i += STEP_WIDTH) {
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
  self.postMessage(pathUpdate);
};
