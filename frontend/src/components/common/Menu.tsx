import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import cn from "@/utils/tw-merge";

interface MenuItem
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: ReactNode;
  label: ReactNode;
  wrapClassName?: string;
}

interface Props {
  menus: MenuItem[];
  className?: string;
  width?: number | string;
}

export default function Menu({ menus, className, width }: Props) {
  return (
    <div
      className={cn(
        "menu",
        "bg-bgPrimary rounded-md border border-solid border-borderSecondary",
        className,
      )}
      style={{
        width,
      }}
    >
      {menus.map(({ icon, label, wrapClassName, ...itemProps }, index) => (
        <div
          key={index}
          className={cn(
            "item",
            "p-sm border-t border-solid border-t-borderSecondary first:border-t-0",
            wrapClassName,
          )}
        >
          <button
            {...itemProps}
            className={cn(
              "item-btn",
              "p-3 w-full flex items-center gap-md rounded-sm border-none font-medium text-sm duration-200 hover:bg-[#00000010] disabled:cursor-not-allowed",
              itemProps.className,
            )}
          >
            {icon}
            {label}
          </button>
        </div>
      ))}
    </div>
  );
}
