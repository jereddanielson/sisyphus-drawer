import * as React from "react";

type Props = {
  value: string | number;
  type: "text" | "number";
  updater: Function;
  label: string;
  step?: number;
  min?: number;
  max?: number;
};

export const Fiddle: React.FC<Props> = ({
  value,
  type,
  updater,
  label,
  step = 1,
  min = -Infinity,
  max = Infinity
}) => {
  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      <span>{label}: </span>
      <button
        onClick={() => {
          updater(i => Math.min(Math.max(i - step * 100, min), max));
        }}
      >
        -{step * 100}
      </button>
      <button
        onClick={() => {
          updater(i => Math.min(Math.max(i - step * 10, min), max));
        }}
      >
        -{step * 10}
      </button>
      <button
        onClick={() => {
          updater(i => Math.min(Math.max(i - step, min), max));
        }}
      >
        -{step}
      </button>
      <input
        type={type}
        value={value}
        onChange={e => {
          updater(Number(e.target.value));
        }}
        step={step}
      ></input>
      <button
        onClick={() => {
          updater(i => Math.min(Math.max(i + step, min), max));
        }}
      >
        +{step}
      </button>
      <button
        onClick={() => {
          updater(i => Math.min(Math.max(i + step * 10, min), max));
        }}
      >
        +{step * 10}
      </button>
      <button
        onClick={() => {
          updater(i => Math.min(Math.max(i + step * 100, min), max));
        }}
      >
        +{step * 100}
      </button>
    </div>
  );
};
