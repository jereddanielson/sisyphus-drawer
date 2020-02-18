export interface P {
  cmd: "M" | "m" | "L" | "l" | "C" | "c" | "A" | "a";
  endX: number;
  endY: number;
  getPath: (xScale?: number, yScale?: number) => string;
}

export interface MoveAbs extends P {
  cmd: "M";
}

export const M = (endX: number, endY: number): MoveAbs => {
  return {
    cmd: "M",
    endX,
    endY,
    getPath: function(xScale = 1, yScale = 1) {
      return `${this.cmd}${this.endX * xScale},${this.endY * yScale}`;
    }
  };
};

export interface MoveRel extends P {
  cmd: "m";
}

export const m = (endX: number, endY: number): MoveRel => {
  return {
    cmd: "m",
    endX,
    endY,
    getPath: function(xScale = 1, yScale = 1) {
      return `${this.cmd}${this.endX * xScale},${this.endY * yScale}`;
    }
  };
};

export interface LineAbs extends P {
  cmd: "L";
}

export const L = (endX: number, endY: number): LineAbs => {
  return {
    cmd: "L",
    endX,
    endY,
    getPath: function(xScale = 1, yScale = 1) {
      return `${this.cmd}${this.endX * xScale},${this.endY * yScale}`;
    }
  };
};

export interface LineRel extends P {
  cmd: "l";
}

export const l = (endX: number, endY: number): LineRel => {
  const ret = L(endX, endY);
  return { ...ret, cmd: "l" };
};

export interface CurveAbs extends P {
  cmd: "C";
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
}

export const C = (
  controlX1: number,
  controlY1: number,
  controlX2: number,
  controlY2: number,
  endX: number,
  endY: number
): CurveAbs => {
  return {
    cmd: "C",
    controlX1,
    controlY1,
    controlX2,
    controlY2,
    endX,
    endY,
    getPath: function(xScale = 1, yScale = 1) {
      return `${this.cmd}${this.controlX1 * xScale},${this.controlY1 *
        yScale} ${this.controlX2 * xScale},${this.controlY2 * yScale} ${this
        .endX * xScale},${this.endY * yScale}`;
    }
  };
};

export interface CurveRel extends P {
  cmd: "c";
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
}

export const c = (
  controlX1: number,
  controlY1: number,
  controlX2: number,
  controlY2: number,
  endX: number,
  endY: number
): CurveRel => {
  const ret = C(controlX1, controlY1, controlX2, controlY2, endX, endY);
  return { ...ret, cmd: "c" };
};

export interface ArcAbs extends P {
  cmd: "A";
  radiusX: number;
  radiusY: number;
  rotationAxisX: number;
  flagLargeArc: 0 | 1;
  flagSweep: 0 | 1;
}

export const A = (
  radiusX: number,
  radiusY: number,
  rotationAxisX: number,
  flagLargeArc: 0 | 1,
  flagSweep: 0 | 1,
  endX: number,
  endY: number
): ArcAbs => {
  return {
    cmd: "A",
    radiusX,
    radiusY,
    rotationAxisX,
    flagLargeArc,
    flagSweep,
    endX,
    endY,
    getPath: function(xScale = 1, yScale = 1) {
      return `${this.cmd}${this.radiusX},${this.radiusY} ${
        this.rotationAxisX
      } ${this.flagLargeArc} ${this.flagSweep} ${this.endX * xScale},${this
        .endY * yScale}`;
    }
  };
};

export interface ArcRel extends P {
  cmd: "a";
  radiusX: number;
  radiusY: number;
  rotationAxisX: number;
  flagLargeArc: 0 | 1;
  flagSweep: 0 | 1;
}

export const a = (
  radiusX: number,
  radiusY: number,
  rotationAxisX: number,
  flagLargeArc: 0 | 1,
  flagSweep: 0 | 1,
  endX: number,
  endY: number
): ArcRel => {
  const ret = A(
    radiusX,
    radiusY,
    rotationAxisX,
    flagLargeArc,
    flagSweep,
    endX,
    endY
  );
  return { ...ret, cmd: "a" };
};

export type AnyCurve =
  | MoveRel
  | MoveAbs
  | CurveRel
  | CurveAbs
  | LineRel
  | LineAbs
  | ArcRel
  | ArcAbs;

export type RelCurve = MoveRel | CurveRel | LineRel | ArcRel;

export type AbsCurve = MoveAbs | CurveAbs | LineAbs | ArcAbs;