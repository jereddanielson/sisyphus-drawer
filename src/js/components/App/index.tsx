import * as React from "react";
import "./index.scss";
import CanvasRenderer from "Components/CanvasRenderer";

const Block: React.FC<{ block: S.Block }> = ({ block }) => {
  const c = block.curve;
  const path = `M ${c.p1.x} ${c.p1.y} C ${c.p2.x} ${c.p2.y}, ${c.p3.x} ${c.p3.y}, ${c.p4.x} ${c.p4.y}`;

  return (
    <>
      <path stroke={"black"} fill={"transparent"} d={path} />
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
        p1: { x: 10, y: 10 },
        p2: { x: 20, y: 20 },
        p3: { x: 40, y: 20 },
        p4: { x: 50, y: 10 }
      }
    },
    {
      id: 1,
      index: 1,
      curve: {
        p1: { x: 25, y: 10 },
        p2: { x: 50, y: 20 },
        p3: { x: 70, y: 20 },
        p4: { x: 50, y: 10 }
      }
    }
  ]);

  return (
    <div className="app">
      <CanvasRenderer blocks={blocks} />
      <div id="timeline">
        <svg
          width={200}
          height={200}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {blocks.map(eaBlock => {
            return <Block key={eaBlock.id} block={eaBlock} />;
          })}
        </svg>
      </div>
    </div>
  );
};

export default App;
