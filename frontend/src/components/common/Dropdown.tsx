"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import useResize from "@/hooks/useResize";
import useClickOutside from "@/hooks/useClickOutside";
import cn from "@/utils/tw-merge";

export interface Props {
  children: ReactNode;
  content: ReactNode;
  trigger?: "hover" | "click";
  active?: boolean;
  defaultActive?: boolean;
  position?: {
    x?: "left" | "right" | "center" | "left-start" | "right-start";
    y?: "top" | "bottom" | "center" | "top-start" | "bottom-start";
  };
  contentClassName?: string;
  contentActiveClassName?: string;
  triggerClassName?: string;
  className?: string;
  onActiveChange?: (active: boolean) => void;
  onTrigger?: (e: MouseEvent, currentShow: boolean) => boolean;
}

/**
 * @prop trigger default=hover
 * @prop position default={x:'left-start', y:'bottom'}
 * @prop defaultActive default=false
 */
export default function DropDown({
  children,
  content,
  trigger = "hover",
  active,
  defaultActive = false,
  position,
  contentClassName,
  contentActiveClassName,
  triggerClassName,
  className,
  onActiveChange,
  onTrigger,
}: Props) {
  const [show, setShow] = useState(defaultActive);
  const [height, setHeight] = useState(0);
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const contenRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const timeOutRef = useRef<number | null>(null);

  const _active = typeof active === "boolean" ? active : show;

  useEffect(() => {
    typeof active === "boolean" && setShow(active);
  }, [active]);

  useEffect(() => {
    const handleHover = () => {
      if (trigger === "hover") setShow(true);
    };

    const handleMouseLeave = () => {
      if (trigger === "hover") {
        timeOutRef.current = window.setTimeout(() => {
          setShow(false);
        }, 100);
      }
    };

    const handleContentMouseEnter = () => {
      if (timeOutRef.current && trigger === "hover")
        clearTimeout(timeOutRef.current);
    };

    const handleContentMouseLeave = () => {
      if (trigger === "hover") setShow(false);
    };

    const handleClick = (e: MouseEvent) => {
      if (trigger === "click") {
        const allow = onTrigger ? onTrigger(e, _active) : true;
        if (allow) setShow((prev) => !prev);
      }
    };

    triggerRef.current?.addEventListener("mouseenter", handleHover);
    triggerRef.current?.addEventListener("mouseleave", handleMouseLeave);
    triggerRef.current?.addEventListener("click", handleClick);

    contenRef.current?.addEventListener("mouseenter", handleContentMouseEnter);
    contenRef.current?.addEventListener("mouseleave", handleContentMouseLeave);

    return () => {
      triggerRef.current?.removeEventListener("mouseenter", handleHover);
      triggerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      triggerRef.current?.removeEventListener("click", handleClick);

      contenRef.current?.removeEventListener(
        "mouseenter",
        handleContentMouseEnter,
      );
      contenRef.current?.removeEventListener(
        "mouseleave",
        handleContentMouseLeave,
      );
    };
  }, [_active]);

  useEffect(() => {
    onActiveChange && onActiveChange(show);
  }, [show]);

  useResize(contenRef, () => {
    setHeight(contenRef.current?.offsetHeight || 0);
  }, []);

  useClickOutside(dropDownRef, () => {
    setShow(false);
  }, []);

  return (
    <div ref={dropDownRef} className={cn("dropdown", "relative", className)}>
      <div ref={triggerRef} className={cn("trigger", triggerClassName)}>
        {children}
      </div>
      <div
        className={cn(
          "content-wrapper",
          "absolute duration-300 overflow-hidden z-20 w-fit",
          {
            "right-full": position?.x === "left",
            "left-full": position?.x === "right",
            "left-1/2 -translate-x-1/2": position?.x === "center",
            "left-0": position?.x === "left-start" || !position?.x,
            "right-0": position?.x === "right-start",

            "bottom-full": position?.y === "top",
            "top-full": position?.y === "bottom" || !position?.y,
            "top-1/2 -translate-y-1/2": position?.y === "center",
            "top-0": position?.y === "top-start",
            "bottom-0": position?.y === "bottom-start",

            "-translate-x-1/2 -translate-y-1/2":
              position?.x === "center" && position?.y === "center",
          },
          contentClassName,
          _active ? contentActiveClassName : undefined,
        )}
        style={{
          height: _active ? height : 0,
        }}
      >
        <div ref={contenRef} className={cn("content")}>
          {content}
        </div>
      </div>
    </div>
  );
}
