import * as React from "react";

import "./index.scss";
import { P, CurveRel, AnyCurve, l } from "Utils";

const VIEWSCALE_MIN = 0.1;
const VIEWSCALE_MAX = 10;

type Props = {
  pathData: AnyCurve[];
  updatePathData: (index: number, path: AnyCurve) => void;
  deletePath: (index) => void;
  addPath: (AnyCurve) => void;
};

export const PathChunkEditor: React.FC<Props> = ({
  pathData,
  updatePathData,
  deletePath,
  addPath
}) => {
  const [viewBox, setViewBox] = React.useState({ x: 20, y: 20 });
  const [selectedIndex, setSelectedIndex] = React.useState<number>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  // const [moveScale, setMoveScale] = React.useState(0.1);
  const [viewScale, setViewScale] = React.useState(1);

  const pen = { x: 0, y: 0 };
  const brokenPathData = [];
  pathData.forEach((ea, i) => {
    const { x, y } = pen;
    pen.x += ea.endX;
    pen.y += ea.endY;
    const segment: any = {
      cmd: ea.cmd,
      d: `M${x},${y}${ea.getPath()}`,
      startX: x,
      startY: y,
      endX: pen.x,
      endY: pen.y
    };
    if (ea.cmd === "c") {
      segment.controlX1 = ea.controlX1 + x;
      segment.controlY1 = ea.controlY1 + y;
      segment.controlX2 = ea.controlX2 + x;
      segment.controlY2 = ea.controlY2 + y;
    }
    brokenPathData.push(segment);
  });

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      const lastMouse = { x: e.clientX, y: e.clientY };

      const onMouseMove = (e: MouseEvent) => {
        setOffset(lastOffset => {
          const dx = e.clientX - lastMouse.x;
          const dy = e.clientY - lastMouse.y;
          lastMouse.x = e.clientX;
          lastMouse.y = e.clientY;
          return {
            x: lastOffset.x + dx / 20,
            y: lastOffset.y + dy / 20
          };
        });
      };

      const removeListener = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", removeListener);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", removeListener);
    },
    [setOffset]
  );

  const onControlHandleMouseDown = React.useCallback(
    (e: React.MouseEvent<SVGElement>, fn: Function) => {
      const firstMouse = { x: e.clientX, y: e.clientY };

      const onMouseMove = e => {
        const dx = e.clientX - firstMouse.x;
        const dy = e.clientY - firstMouse.y;
        fn(dx, dy);
      };

      const removeListener = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", removeListener);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", removeListener);
    },
    []
  );

  const selectedCurve = brokenPathData[selectedIndex];

  const cpScale = Math.sqrt(1 / Math.max(viewScale, 0.001));

  const moveScale = 0.01;

  return (
    <>
      <div>
        <button
          onClick={() => {
            deletePath(selectedIndex);
            if (selectedIndex > 0) {
              setSelectedIndex(selectedIndex - 1);
            } else {
              setSelectedIndex(null);
            }
          }}
        >
          Delete
        </button>
        <button
          onClick={() => {
            addPath(l(pen.x, pen.y));
          }}
        >
          Add line
        </button>
        <input
          type="number"
          value={viewScale}
          step={0.1}
          onChange={e => {
            setViewScale(Number(e.target.value));
          }}
        />
      </div>
      <svg
        className="path-chunk-editor"
        viewBox={`0 0 ${viewBox.x} ${viewBox.y}`}
        onMouseDown={onMouseDown}
        onWheel={e => {
          const dy = e.deltaY;
          setViewScale(oldViewScale => {
            return Math.min(
              Math.max(oldViewScale + dy / -1000, VIEWSCALE_MIN),
              VIEWSCALE_MAX
            );
          });
        }}
      >
        <rect
          x={0}
          y={0}
          width={100}
          height={100}
          fill={"rgba(0, 0, 0, .2)"}
        ></rect>
        <g
          transform={`scale(${viewScale}) translate(${offset.x} ${offset.y})`}
          style={{ transformOrigin: "center center" }}
        >
          <g transform={`translate(${viewBox.x / 2} ${viewBox.y / 2})`}>
            {brokenPathData.map((ea, i) => {
              const isSelected = i === selectedIndex;
              return (
                <g key={i}>
                  <path
                    onClick={() => {
                      if (isSelected) {
                        setSelectedIndex(null);
                      } else {
                        setSelectedIndex(i);
                      }
                    }}
                    d={ea.d}
                    fill={"transparent"}
                    stroke={isSelected ? "red" : "black"}
                    strokeWidth={0.5}
                  />
                </g>
              );
            })}
            {selectedIndex !== null && (
              <g>
                {/* <circle
                  cx={selectedCurve.startX}
                  cy={selectedCurve.startY}
                  r={0.5}
                  fill={"red"}
                /> */}
                <circle
                  onMouseDown={e => {
                    e.stopPropagation();
                    onControlHandleMouseDown(e, (dx, dy) => {
                      const og = pathData[selectedIndex];
                      updatePathData(selectedIndex, {
                        ...og,
                        endX: og.endX + dx * moveScale,
                        endY: og.endY + dy * moveScale
                      });
                    });
                  }}
                  cx={selectedCurve.endX}
                  cy={selectedCurve.endY}
                  r={0.5 * cpScale}
                  fill={"salmon"}
                />
                {selectedCurve.cmd === "c" && (
                  <g>
                    <path
                      className="svg-control-line"
                      strokeWidth={0.25}
                      stroke={"green"}
                      fill={"transparent"}
                      d={`M${selectedCurve.startX},${selectedCurve.startY} L${selectedCurve.controlX1},${selectedCurve.controlY1}`}
                    ></path>
                    <path
                      className="svg-control-line"
                      strokeWidth={0.25}
                      stroke={"green"}
                      fill={"transparent"}
                      d={`M${selectedCurve.endX},${selectedCurve.endY} L${selectedCurve.controlX2},${selectedCurve.controlY2}`}
                    ></path>
                    <rect
                      onMouseDown={e => {
                        e.stopPropagation();
                        onControlHandleMouseDown(e, (dx, dy) => {
                          const og = pathData[selectedIndex] as CurveRel;
                          updatePathData(selectedIndex, {
                            ...og,
                            controlX1: og.controlX1 + dx * moveScale,
                            controlY1: og.controlY1 + dy * moveScale
                          });
                        });
                      }}
                      x={selectedCurve.controlX1 - 0.5 * cpScale}
                      y={selectedCurve.controlY1 - 0.5 * cpScale}
                      width={1 * cpScale}
                      height={1 * cpScale}
                      fill={"salmon"}
                    />
                    <rect
                      onMouseDown={e => {
                        e.stopPropagation();
                        onControlHandleMouseDown(e, (dx, dy) => {
                          const og = pathData[selectedIndex] as CurveRel;
                          updatePathData(selectedIndex, {
                            ...og,
                            controlX2: og.controlX2 + dx * moveScale,
                            controlY2: og.controlY2 + dy * moveScale
                          });
                        });
                      }}
                      x={selectedCurve.controlX2 - 0.5 * cpScale}
                      y={selectedCurve.controlY2 - 0.5 * cpScale}
                      width={1 * cpScale}
                      height={1 * cpScale}
                      fill={"salmon"}
                    />
                  </g>
                )}
              </g>
            )}
          </g>
        </g>
      </svg>
    </>
  );
};
