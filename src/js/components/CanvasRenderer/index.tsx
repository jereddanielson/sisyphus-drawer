import * as React from "react";
import "./index.scss";

const CanvasRenderer: React.FC<{ blocks: S.Block[] }> = ({ blocks }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Imperatively render
  React.useEffect(() => {
    //
  }, [blocks]);

  return (
    <div id="canvas-renderer">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default CanvasRenderer;
