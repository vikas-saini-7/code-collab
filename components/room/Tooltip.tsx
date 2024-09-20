// components/Tooltip.tsx
import React from "react";

interface TooltipProps {
  text: string;
  position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ text, position }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundColor: "black",
        color: "white",
        padding: "5px",
        borderRadius: "3px",
        pointerEvents: "none",
        transform: "translate(100%, 8px)", // Adjusted to position below the cursor
      }}
    >
      {text}
    </div>
  );
};

export default Tooltip;
