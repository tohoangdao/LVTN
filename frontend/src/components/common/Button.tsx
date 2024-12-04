"use client";

import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";
import ChevronDown from "@/assets/chevron-down.svg";
import LoadingIcon from "@/assets/loading.svg";
import DropDown, { Props as DropDownProps } from "@/components/common/Dropdown";
import cn from "@/utils/tw-merge";

interface Props
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "type"
  > {
  type?: "primary" | "secondary" | "default" | "text" | "danger";
  htmlType?: "button" | "submit" | "reset";
  size?: "xxl" | "lg" | "md";
  dropDown?: Omit<DropDownProps, "children">;
  loading?: boolean;
}

/**
 * @prop type default='default'
 * @prop size default='lg'
 */
export default function Button({
  htmlType,
  type = "default",
  children,
  className,
  size = "lg",
  dropDown,
  loading,
  disabled,
  ...props
}: Props) {
  const [dropDownShow, setDropDownShow] = useState(
    dropDown?.defaultActive || false,
  );

  if (dropDown)
    return (
      <DropDown
        {...dropDown}
        onActiveChange={(show) => {
          setDropDownShow(show);
          dropDown.onActiveChange && dropDown.onActiveChange(show);
        }}
        triggerClassName="rounded-md"
      >
        <button
          type={htmlType}
          {...props}
          className={cn(
            "button",
            "rounded-md border-none flex items-center justify-center gap-lg px-4 font-semibold text-base duration-200 w-full relative",
            {
              "bg-buttonPrimaryBg text-textPrimaryOnBrand": type === "primary",
              "bg-buttonSecondaryBg border border-solid border-buttonSecondaryColorBorder text-buttonSecondaryColorFg":
                type === "secondary",
              "bg-buttonPrimaryFg text-textSecondary border border-solid border-borderPrimary shadow-[0px_1px_2px_0px_#1018280d]":
                type === "default",
              "bg-buttonPrimaryErrorBg text-textWhite": type === "danger",
            },
            {
              "h-xl5 text-sm": size === "md",
              "h-11": size === "lg",
              "h-16 text-lg px-xl3 gap-4": size === "xxl",
            },
            "disabled:cursor-not-allowed disabled:opacity-60",
            {
              "disabled:bg-bgDisabled": type !== "primary" && type !== "danger",
            },
            {
              "hover:shadow-[0_1px_4px_#1018280d]":
                !disabled && type !== "text",
              "hover:bg-bgSecondaryHover": !disabled && type === "text",
            },
            className,
          )}
        >
          {children}
          <span
            className={cn("arrow-icon", "block duration-200", {
              "rotate-180": dropDownShow,
            })}
          >
            <ChevronDown className="block" />
          </span>
        </button>
      </DropDown>
    );

  return (
    <button
      type={htmlType}
      {...props}
      className={cn(
        "button",
        "rounded-md border-none flex items-center justify-center gap-lg px-4 font-semibold text-base duration-200 w-full relative",
        {
          "bg-buttonPrimaryBg text-textPrimaryOnBrand": type === "primary",
          "bg-buttonSecondaryBg border border-solid border-buttonSecondaryColorBorder text-buttonSecondaryColorFg":
            type === "secondary",
          "bg-buttonPrimaryFg text-textSecondary border border-solid border-borderPrimary shadow-[0px_1px_2px_0px_#1018280d]":
            type === "default",
          "bg-buttonPrimaryErrorBg text-textWhite": type === "danger",
        },
        {
          "h-xl5 text-sm": size === "md",
          "h-11": size === "lg",
          "h-16 text-lg px-xl3 gap-4": size === "xxl",
        },
        "disabled:cursor-not-allowed disabled:opacity-60",
        {
          "disabled:bg-bgDisabled": type !== "primary" && type !== "danger",
        },
        {
          "hover:-translate-y-0.5": !disabled && !loading,
          "hover:shadow-[0_1px_4px_#1018280d]": !disabled && type !== "text",
          "hover:bg-bgSecondaryHover": !disabled && type === "text",
        },
        className,
      )}
      disabled={disabled || loading}
    >
      {children}

      <div
        className={cn(
          "loading",
          "absolute inset-0 bg-[#00000008] flex items-center justify-center backdrop-blur-sm duration-200 invisible opacity-0",
          { "visible opacity-100": loading },
        )}
      >
        <LoadingIcon
          className={cn("animate-loading", {
            "invert-[0.9]": type === "primary",
          })}
        />
      </div>
    </button>
  );
}
