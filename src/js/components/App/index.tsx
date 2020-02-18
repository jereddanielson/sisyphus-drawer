import { CanvasRenderer } from "Components/CanvasRenderer";
import { Fiddle } from "Components/Fiddle";
import { PathChunkEditor } from "Components/PathChunkEditor";
import { Timeline } from "Components/Timeline";
import * as React from "react";
import "./index.scss";

import { P, M, m, C, c, A, a, L, l, AnyCurve } from "Utils";

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

interface Block {
  paths: AnyCurve[];
  iters: number;
}

const test: AnyCurve[] = [
  c(2, 0, 4, 4, 4, 8),
  a(1, 1, 0, 1, 1, -1, -1),
  c(3, -1, 2, -5, -0.5, -7)
];

const App: React.FC = () => {
  const [iters, setIters] = React.useState(1);
  const [coarseness, setCoarseness] = React.useState(1);
  const [xScalePerIter, setXScalePerIter] = React.useState(0);

  const [pathData, setPathData] = React.useState<AnyCurve[]>(test);

  let path = "m0,0";

  // X U
  // path = "m0,0 l";
  // const iters = 900;
  // for (let i = iters; i > 0; i--) {
  //   path = `${path} 10,10 -10,0 11,-10`;
  // }

  // xring2
  // path = 'm0,0 l';
  // const iters = 50;
  // for (let i = iters; i > 0; i--) {
  //   path = `${path} 10,10 -10,0 11,-10`;
  // }

  // tricirc
  // path = "M0,0 ";
  // const iters = 33;
  // for (let i = iters; i > 0; i--) {
  //   path += `l2,8 a2,2,0,1,0,-.1,-.2 l4,8 l4,-8 a2,2,0,1,0,-.1,.2 l4,-8 l-8,0 a2,2,0,1,0,.1,0 l-7,0 l15,0`;
  // }

  //
  // path = "M0,0 ";
  // for (let i = iters; i > 0; i--) {
  //   path += pathChunk;
  // }

  for (let i = 0; i < iters; i++) {
    pathData.forEach(ea => {
      path += ea.getPath(1 + xScalePerIter);
    });
  }

  return (
    <>
      <div id="left"></div>
      <div id="mid">
        <CanvasRenderer
          path={path}
          // yScale={0.999}
          // yStep={-0.48}
          // xStep={0.45}
          // yStepInc={100}
          // xStepInc={100}
          yStep={0}
          xStep={0}
          yStepInc={0}
          xStepInc={0}
          stepWidth={coarseness}
        />
        <Timeline path={path} />
      </div>
      <div id="right">
        <div>
          <Fiddle
            label={"Iters"}
            type={"number"}
            value={iters}
            updater={setIters}
            min={0}
          />
          <Fiddle
            label={"Coarseness"}
            type={"number"}
            value={coarseness}
            updater={setCoarseness}
            step={0.1}
            min={0.1}
          />
          <Fiddle
            label={"X Scale ++"}
            type={"number"}
            value={xScalePerIter}
            updater={setXScalePerIter}
            step={0.01}
            min={0.01}
          />
          {/* <Fiddle
            label={"Path"}
            type={"text"}
            value={pathChunk}
            updater={setPathChunk}
          /> */}
        </div>
        <div>
          <PathChunkEditor
            pathData={pathData}
            updatePathData={(index, path) => {
              setPathData(oldPathData => {
                const c = [...oldPathData];
                c[index] = path;
                return c;
              });
            }}
            deletePath={index => {
              setPathData(oldPathData => {
                return oldPathData.filter((ea, i) => {
                  return i < index;
                });
              });
            }}
            addPath={newPath => {
              setPathData(oldPathData => {
                return [...oldPathData, newPath];
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default App;
