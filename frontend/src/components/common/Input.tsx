"use client";

import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useId,
} from "react";
import cn from "@/utils/tw-merge";

interface Props
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "prefix"
  > {
  label?: string;
  prefix?: ReactNode;
  width?: number | string;
  componentType?: "textarea" | "input";
  error?: string;
  rows?: number;
  required?: boolean;
  errorAsBlock?: boolean;
}

export default function Input({
  label,
  prefix,
  width,
  componentType = "input",
  error,
  rows,
  required = false,
  errorAsBlock,
  ...props
}: Props) {
  const id = useId();

  const renderUI = () => {
    if (componentType === "textarea")
      return (
        <textarea
          id={props.id || id}
          rows={rows || 5}
          {...(props as Record<string, unknown>)}
          className={cn(
            "textarea",
            "outline-none border-none w-full resize-none text-base py-lg",
            props.className,
          )}
        ></textarea>
      );

    return (
      <input
        id={props.id || id}
        {...props}
        className={cn(
          "outline-none border-none bg-transparent grow text-base overflow-hidden w-full",
          props.className,
        )}
      />
    );
  };

  return (
    <div
      className={cn("input-wrap", "relative")}
      style={{
        width,
      }}
    >
      {label && (
        <label
          className={cn(
            "label-input",
            "text-base font-medium text-textSecondary inline-block pb-sm",
            {
              "text-textErrorPrimary": error,
            },
          )}
          htmlFor={props.id || id}
        >
          {label}
          {required && <span className={cn("text-textErrorPrimary")}> *</span>}
        </label>
      )}
      <label
        htmlFor={props.id || id}
        className={cn(
          "input-box",
          "bg-bgPrimary rounded-md flex items-center min-h-11 gap-md px-4 border border-solid border-borderPrimary duration-200",
          "focus-within:shadow-[0px_1px_2px_0px_#1018280d]",
          "has-[.textarea]:pr-xs has-[.textarea]:overflow-hidden",
          {
            "border-bgErrorSolid": error,
          },
        )}
      >
        {prefix && <div className={cn("prefix", "shrink-0")}>{prefix}</div>}
        {renderUI()}
      </label>
      {error && (
        <p
          className={cn(
            "error-text",
            "text-textErrorPrimary p-0 text-sm text-right",
            { "absolute right-0 top-full": !errorAsBlock },
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}
