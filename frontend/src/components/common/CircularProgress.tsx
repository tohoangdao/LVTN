import React from "react";
import cn from "@/utils/tw-merge";

const CircularProgress = () => {
  return (
    <div className={cn("flex")}>
      <span
        className={cn(
          "inline-block w-10 h-10 text-fgBrandPrimary animate-spin",
        )}
        role="progressbar"
      >
        <svg className={cn("block")} viewBox="22 22 44 44">
          <circle
            className={cn("stroke-current animate-dash")}
            style={{ strokeDasharray: "80px 200px", strokeDashoffset: 0 }}
            cx="44"
            cy="44"
            r="20.2"
            fill="none"
            strokeWidth="3.6"
          ></circle>
        </svg>
      </span>
    </div>
  );
};

export default CircularProgress;
