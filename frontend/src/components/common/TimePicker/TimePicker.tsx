"use client";
import { ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import generateKey from "@/utils/generate-key";
import useResize from "@/hooks/useResize";

import CloseFilledIcon from "@/assets/close-filled.svg";
import CheveronDownIcon from "@/assets/chevron-down.svg";

import {
  convertDateToFormat,
  convertTimeToDateObject,
  HH_MM_FORMAT,
} from "@/utils/date-utils";

import cn from "@/utils/tw-merge";
import "./TimePicker.css";

interface Props {
  id?: string;
  label?: ReactNode;
  value: null | string | undefined; // of format: HH:mm
  timeFormat?: string;
  timeInterval?: number;
  error?: string;
  placeholder?: string;
  onChange: (time: string | null) => void;
  onCalendarClose?: () => void;
}

export default function TimePicker({
  id,
  label,
  value,
  timeFormat = HH_MM_FORMAT,
  timeInterval,
  error,
  placeholder,
  onChange,
  onCalendarClose,
}: Props) {
  const _id = useId();
  const [errorHeight, setErrorHeight] = useState(0);

  const ref = useRef<ReactDatePicker>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const idAsClassName = useMemo(() => generateKey(), []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const scrollableAncestor = findScrollableAncestor(wrapRef.current);

    scrollableAncestor.forEach((el) =>
      el.addEventListener("scroll", updateDropdownPosition),
    );
    window.addEventListener("resize", updateDropdownPosition);

    setTimeout(() => {
      updateDropdownPosition();
    }, 1);

    return () => {
      scrollableAncestor.forEach((el) =>
        el.removeEventListener("scroll", updateDropdownPosition),
      );
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, []);

  useResize(errorRef, () => {
    setErrorHeight(errorRef.current?.offsetHeight || 0);
  }, []);

  const findScrollableAncestor = (el: HTMLElement) => {
    const els = [];
    let _el: HTMLElement | null = el;
    while (_el) {
      const overflowY = window.getComputedStyle(_el).overflowY;
      const overflowX = window.getComputedStyle(_el).overflowX;
      const overflow = window.getComputedStyle(_el).overflow;

      if (
        overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowX === "auto" ||
        overflowX === "scroll" ||
        overflow === "auto" ||
        overflow === "scroll"
      ) {
        els.push(_el);
      }
      _el = _el.parentElement;
    }

    els.push(window);
    return els;
  };

  const updateDropdownPosition = () => {
    const popup = document.querySelector(`.${idAsClassName}`) as HTMLElement;

    if (wrapRef.current && popup) {
      const selectRect = wrapRef.current.getBoundingClientRect();

      if (
        window.innerHeight - selectRect.bottom < popup.offsetHeight &&
        selectRect.top > popup.offsetHeight
      ) {
        popup.style.top = `${selectRect.top - popup.offsetHeight - 2}px`;
      } else {
        popup.style.top = `${selectRect.bottom + 2}px`;
      }

      popup.style.left = `${selectRect.left}px`;
      popup.style.left = `${selectRect.left + window.scrollX}px`;
      popup.style.width = `${selectRect.width}px`;
      popup.style.visibility = "visible";
    }
  };

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={id || _id}
          className={cn(
            "label",
            "text-base font-medium text-textSecondary inline-block pb-sm duration-200",
            { "text-textErrorPrimary": !!error },
          )}
        >
          {label}
        </label>
      )}
      <div ref={wrapRef} className="relative">
        <ReactDatePicker
          onCalendarClose={onCalendarClose}
          selected={value ? convertTimeToDateObject(value) : null}
          onChange={(date) => {
            if (date) onChange(convertDateToFormat(date, timeFormat));
          }}
          dateFormat={timeFormat}
          timeFormat={timeFormat}
          className={cn(
            "w-full h-full outline-none rounded-md px-3 text-base font-semibold text-textSecondary duration-200 border border-solid border-borderSecondary placeholder:font-normal",
            {
              "focus:border focus:border-solid focus:border-borderBrand focus:shadow-[0px_0px_0px_4px_#9e77ed3d,0px_1px_2px_0px_#1018280d]":
                !error,
              "border-borderErrorSolid": !!error,
            },
          )}
          popperClassName={`!fixed invisible !z-50 ${idAsClassName}`}
          // locale={"en-US"}
          autoComplete="off"
          id={id || _id}
          placeholderText={placeholder || "Select"}
          onInputClick={() => {
            setTimeout(updateDropdownPosition);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeCaption="Time"
          timeIntervals={timeInterval}
          ref={ref}
        />
        <label
          className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 p-1"
          htmlFor={id || _id}
        >
          <CheveronDownIcon className="block" />
        </label>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hidden group-hover:block"
          onClick={() => onChange(null)}
        >
          <CloseFilledIcon className="block" />
        </button>
      </div>
      {error && (
        <div
          className="text-sm text-red-500 text-right mt-1 transition-height duration-200 ease-in-out"
          style={{ height: errorHeight }}
        >
          <p ref={errorRef}>{error}</p>
        </div>
      )}
    </div>
  );
}
