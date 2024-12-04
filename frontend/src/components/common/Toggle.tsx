import cn from "@/utils/tw-merge";
import { useId } from "react";

interface Props {
  active?: boolean;
  toggleClassName?: string;
  className?: string;
  onChange?: (value: boolean) => void;
  label?: string;
}

const Toggle = ({
  active,
  className,
  toggleClassName,
  onChange,
  label,
}: Props) => {
  const id = useId();

  return (
    <div className={cn("wrapper", "flex gap-sm items-center", className)}>
      <div
        className={cn("toggle", "relative box-border w-9 h-5", toggleClassName)}
      >
        <input
          id={id}
          type="checkbox"
          checked={active}
          onChange={(e) => {
            onChange && onChange(e.target.checked);
          }}
          className="absolute left-0 top-0 z-10 w-full h-full cursor-pointer opacity-0"
        />
        <label
          htmlFor={id}
          className={cn(
            "relative flex items-center box-border",
            "before:content-empty before:w-9 before:h-5 before:bg-gray-300 before:relative before:inline-block before:rounded-full before:box-border before:transition-all before:duration-200 before:ease-in",
            "after:content-empty after:absolute after:w-4 after:h-4 after:rounded-full after:left-0.5 after:top-0.5 after:z-[2] after:bg-white after:box-border after:shadow-[0_1px_3px_rgba(0,0,0,0.3)] after:transition-all after:duration-200 after:ease-in",
            {
              "before:bg-bgBrandSolid after:left-[18px]": active,
            },
          )}
        ></label>
      </div>
      {label && <span>{label}</span>}
    </div>
  );
};

export default Toggle;
