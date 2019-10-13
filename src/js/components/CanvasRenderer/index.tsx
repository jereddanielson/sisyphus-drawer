import * as React from "react";
import "./index.scss";

const polarize = (pt: S.Point2D) => {
  return {
    x: (100 - pt.y) * Math.cos(pt.x / 10) + 100,
    y: (100 - pt.y) * Math.sin(pt.x / 10) + 100
  };
};

const CanvasRenderer: React.FC<{
  pathRef: React.MutableRefObject<SVGPathElement>;
  blocks: S.Block[];
}> = ({ pathRef, blocks }) => {
  const [pathData, setPathData] = React.useState<string>("");

  React.useEffect(() => {
    setPathData(() => {
      let pathUpdate = "";
      if (pathRef.current) {
        const r = pathRef.current;
        const length = r.getTotalLength();
        const firstPoint = polarize(r.getPointAtLength(0));
        pathUpdate = `M${firstPoint.x},${firstPoint.y}L`;
        for (let i = 0.25; i < length; i += 0.25) {
          const pt = polarize(r.getPointAtLength(i));
          pathUpdate += ` ${pt.x},${pt.y}`;
        }
        const lastPoint = polarize(r.getPointAtLength(length));
        pathUpdate += ` ${lastPoint.x},${lastPoint.y}`;
      }
      return pathUpdate;
    });
  }, [blocks]);

  return (
    <div id="canvas-renderer">
      <svg
        width={400}
        height={400}
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
        <path stroke={"black"} fill={"transparent"} d={pathData} />
      </svg>
    </div>
  );
};

export default CanvasRenderer;
