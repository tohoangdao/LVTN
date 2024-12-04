"use client";
import { Ref, forwardRef, useId } from "react";

import CheckIcon from "@/assets/check.svg";
import cn from "@/utils/tw-merge";

interface Props {
  id?: string;
  type?: "basic" | "round";
  checked?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

function CheckBox(
  { id, type = "basic", checked, className, onChange, disabled = false }: Props,
  ref: Ref<HTMLLabelElement>,
) {
  const genId = useId();
  const mid = id ?? genId;
  return (
    <label
      htmlFor={mid}
      className={cn(
        "checkbox",
        "flex items-center justify-center w-xl2 h-xl2 rounded-md border border-solid border-borderPrimary aspect-square cursor-pointer duration-200",
        { "bg-mainColor": checked },
        { "rounded-full w-xl": type === "round" },
        className,
      )}
      ref={ref}
    >
      <input
        id={mid}
        type="checkbox"
        hidden
        className={cn("input")}
        checked={checked}
        onChange={(e) => {
          onChange && onChange(e.target.checked);
        }}
        disabled={disabled}
      />
      <span className={cn("icon", "text-white hidden", { block: checked })}>
        {type === "round" ? (
          <div
            className={cn(
              "round-solid",
              "w-[6px] h-[6px] rounded-full bg-white",
            )}
          />
        ) : (
          <CheckIcon className="block scale-75" />
        )}
      </span>
    </label>
  );
}

export default forwardRef<HTMLLabelElement, Props>(CheckBox);
