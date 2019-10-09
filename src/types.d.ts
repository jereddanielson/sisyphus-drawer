declare namespace S {
  type Point2D = {
    x: number;
    y: number;
  };

  type BezierCurve = {
    p1: Point2D;
    p2: Point2D;
    p3: Point2D;
    p4: Point2D;
  };

  type Block = {
    id: number;
    index: number;
    curve: BezierCurve;
  };
}
