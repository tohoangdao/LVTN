import { ReactNode } from "react";
import cn from "@/utils/tw-merge";

interface Props {
  children: ReactNode;
  className?: string;
  type?: "success" | "default" | "danger" | "brand" | "golden";
  rounded?: boolean;
  icon?: ReactNode;
  color?: string;
  bgColor?: string;
  borderColor?: string;
}

export default function Badge({
  children,
  className,
  type = "default",
  rounded,
  icon,
  color,
  bgColor,
  borderColor,
}: Props) {
  return (
    <span
      className={cn(
        "badge",
        "flex items-center justify-center gap-xs rounded-md border border-solid border-borderSecondary py-xxs px-md bg-bgSecondary text-xs font-medium text-textSecondary",
        className,
        {
          "text-utilitySuccess700 bg-bgSuccessPrimary border-utilitySuccess200":
            type === "success",
          "text-utilityError700 bg-bgErrorPrimary border-[#fecdca]":
            type === "danger",
          "text-utilityBlue700 bg-utilityBlue50 border-utilityBlue200":
            type === "brand",
          "text-[#b54708] bg-[#fffaeb] border-[#fedf89]": type === "golden",
        },
        { "rounded-full": rounded },
      )}
      style={{
        color,
        backgroundColor: bgColor,
        borderColor,
      }}
    >
      {icon && <div>{icon}</div>}
      {children}
    </span>
  );
}
