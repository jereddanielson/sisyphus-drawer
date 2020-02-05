import * as React from "react";
import "./index.scss";
import CanvasRenderer from "Components/CanvasRenderer";

const Block: React.FC<{ block: S.Block }> = ({ block }) => {
  const pathRef = React.useRef<SVGPathElement>(null);
  const c = block.curve;
  const path = `M ${c.p1.x} ${c.p1.y} C ${c.p2.x} ${c.p2.y}, ${c.p3.x} ${c.p3.y}, ${c.p4.x} ${c.p4.y}`;

  return (
    <>
      <path ref={pathRef} stroke={"black"} fill={"transparent"} d={path} />
      <circle
        onClick={e => {
          console.log(e, e.target);
        }}
        cx={c.p1.x}
        cy={c.p1.y}
        r={4}
        stroke={"transparent"}
        fill={"red"}
      />
    </>
  );
};

const App: React.FC = () => {
  const [blocks, setBlocks] = React.useState<S.Block[]>([
    {
      id: 0,
      index: 0,
      curve: {
        p1: { x: 10, y: 100 },
        p2: { x: 20, y: 80 },
        p3: { x: 40, y: 80 },
        p4: { x: 50, y: 60 }
      }
    }
  ]);

  const pathRef = React.useRef<SVGPathElement>(null);
  let path = "";
  blocks.forEach(ea => {
    const c = ea.curve;
    path += `M ${c.p1.x} ${c.p1.y} C ${c.p2.x} ${c.p2.y}, ${c.p3.x} ${c.p3.y}, ${c.p4.x} ${c.p4.y}`;
  });

  // X U
  // path = "m0,0 l";
  // const iters = 900;
  // for (let i = iters; i > 0; i--) {
  //   path = `${path} 10,10 -10,0 11,-10`;
  // }

  //
  // path = 'm0,0 l';
  // const iters = 50;
  // for (let i = iters; i > 0; i--) {
  //   path = `${path} 10,10 -10,0 11,-10`;
  // }

  //
  path = "M0,0 ";
  const iters = 300;
  for (let i = iters; i > 0; i--) {
    path += `l2,8 a2,2,0,1,0,-.1,-.2 l4,8 l4,-8 a2,2,0,1,0,-.1,.2 l4,-8`;
  }

  const startGrabHandle = React.useCallback(
    (
      blockIndex: number,
      pointField: string,
      mouseDownEvent: React.MouseEvent<SVGElement, MouseEvent>
    ) => {
      const initialMousePos: S.Point2D = {
        x: mouseDownEvent.clientX,
        y: mouseDownEvent.clientY
      };

      const onMouseMove = (mouseMoveEvent: MouseEvent) => {
        setBlocks(oldBlocks => {
          const update = [...oldBlocks];
          const c = update[blockIndex].curve;
          c[pointField].x += (mouseMoveEvent.clientX - initialMousePos.x) / 2;
          c[pointField].y += (mouseMoveEvent.clientY - initialMousePos.y) / 2;
          initialMousePos.x = mouseMoveEvent.clientX;
          initialMousePos.y = mouseMoveEvent.clientY;
          return update;
        });
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    []
  );

  return (
    <div className="app">
      <CanvasRenderer
        pathRef={pathRef}
        blocks={blocks}
        // yScale={0.999}
        yStep={-0.2}
        xStep={0.15}
        yStepInc={40}
        xStepInc={40}
      />
      <div id="timeline">
        <svg
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
              <rect
                fill="rgba(0, 0, 0, .1)"
                x="0"
                width="10"
                height="10"
                y="0"
              />
              <rect
                fill="rgba(0, 0, 0, .1)"
                x="10"
                width="10"
                height="10"
                y="10"
              />
            </pattern>
          </defs>
          <rect width="400" height="100" fill="url(#pattern-checkers)" />
          {/* {blocks.map(eaBlock => {
            return <Block key={eaBlock.id} block={eaBlock} />;
          })} */}

          <path ref={pathRef} stroke={"black"} fill={"transparent"} d={path} />
          <g>
            {blocks.map((eaBlock, i) => {
              const c = eaBlock.curve;
              return (
                <React.Fragment key={i}>
                  <path
                    stroke={"purple"}
                    fill={"transparent"}
                    d={`M${c.p1.x},${c.p1.y}L${c.p2.x},${c.p2.y}`}
                  />
                  <circle
                    stroke={"transparent"}
                    fill={"blue"}
                    cx={c.p1.x}
                    cy={c.p1.y}
                    r={"2"}
                    onMouseDown={e => {
                      startGrabHandle(i, "p1", e);
                    }}
                  />
                  <rect
                    stroke={"transparent"}
                    fill={"red"}
                    x={c.p2.x - 2}
                    y={c.p2.y - 2}
                    width={"4"}
                    height={"4"}
                    onMouseDown={e => {
                      startGrabHandle(i, "p2", e);
                    }}
                  />
                  <path
                    stroke={"purple"}
                    fill={"transparent"}
                    d={`M${c.p3.x},${c.p3.y}L${c.p4.x},${c.p4.y}`}
                  />
                  <rect
                    stroke={"transparent"}
                    fill={"red"}
                    x={c.p3.x - 2}
                    y={c.p3.y - 2}
                    width={"4"}
                    height={"4"}
                    onMouseDown={e => {
                      startGrabHandle(i, "p3", e);
                    }}
                  />
                  <circle
                    stroke={"transparent"}
                    fill={"blue"}
                    cx={c.p4.x}
                    cy={c.p4.y}
                    r={"2"}
                    onMouseDown={e => {
                      startGrabHandle(i, "p4", e);
                    }}
                  />
                </React.Fragment>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default App;
