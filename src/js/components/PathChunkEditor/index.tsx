import * as React from "react";

import "./index.scss";
import { P, CurveRel } from "Utils";

type Props = {
  pathData: P[];
  updatePathData: (index: number, path: P) => void;
};

export const PathChunkEditor: React.FC<Props> = ({
  pathData,
  updatePathData
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const pen = { x: 0, y: 0 };
  const brokenPathData = [];
  pathData.forEach(ea => {
    const { x, y } = pen;
    pen.x += ea.endX;
    pen.y += ea.endY;
    const segment: any = {
      cmd: ea.cmd,
      d: `M${x},${y} ${ea.getPath()}`,
      startX: x,
      startY: y,
      endX: pen.x,
      endY: pen.y
    };
    if (ea.cmd === "c") {
      const curve = ea as CurveRel;
      segment.controlX1 = curve.controlX1 + x;
      segment.controlY1 = curve.controlY1 + y;
      segment.controlX2 = curve.controlX2 + x;
      segment.controlY2 = curve.controlY2 + y;
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

  return (
    <svg
      className="path-chunk-editor"
      viewBox="0 0 20 20"
      onMouseDown={onMouseDown}
    >
      <rect
        x={0}
        y={0}
        width={100}
        height={100}
        fill={"rgba(0, 0, 0, .2)"}
      ></rect>
      <g transform={`translate(${offset.x} ${offset.y})`}>
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
              {isSelected && (
                <g>
                  <circle cx={ea.endX} cy={ea.endY} r={0.5} fill={"salmon"} />
                  <circle
                    cx={ea.startX}
                    cy={ea.startY}
                    r={0.5}
                    fill={"salmon"}
                  />
                  {ea.cmd === "c" && (
                    <g>
                      <circle
                        onMouseDown={e => {
                          e.stopPropagation();
                          onControlHandleMouseDown(e, (dx, dy) => {
                            const og = pathData[i] as CurveRel;
                            updatePathData(i, {
                              ...og,
                              controlX1: og.controlX1 + dx / 20,
                              controlY1: og.controlY1 + dy / 20
                            });
                          });
                        }}
                        cx={ea.controlX1}
                        cy={ea.controlY1}
                        r={0.5}
                        fill={"salmon"}
                      />
                      <circle
                        onMouseDown={e => {
                          e.stopPropagation();
                          onControlHandleMouseDown(e, (dx, dy) => {
                            const og = pathData[i];
                            updatePathData(i, {
                              ...og,
                              controlX2: og.controlX2 + dx / 20,
                              controlY2: og.controlY2 + dy / 20
                            });
                          });
                        }}
                        cx={ea.controlX2}
                        cy={ea.controlY2}
                        r={0.5}
                        fill={"salmon"}
                      />
                    </g>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};
