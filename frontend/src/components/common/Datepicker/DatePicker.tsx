import { ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import moment from "moment";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";

import generateKey from "@/utils/generate-key";
import useResize from "@/hooks/useResize";

import ChevronLeftIcon from "@/assets/chevron-left.svg";
import CloseFilledIcon from "@/assets/close-filled.svg";
import ChevronRightIcon from "@/assets/chevron-right.svg";
import CalendarIcon from "@/assets/calendar.svg";

import Button from "../Button";

import cn from "@/utils/tw-merge";
import "./Datepicker.css";

interface Props {
  id?: string;
  label?: ReactNode;
  value: null | Date;
  dateFormat?: string;
  error?: string;
  placeholder?: string;
  onChange: (date: Date | null) => void;
  onCalendarClose?: () => void;
}

const weekDayMapping = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

moment.locale("vi", {
  months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
    (i) => `${months[i - 1]}`,
  ),
});
registerLocale("en-US", {
  ...enUS,
  options: {
    ...enUS.options,
    weekStartsOn: 1,
  },
});

export default function DatePicker({
  id,
  label,
  value,
  dateFormat = "dd/MM/yyyy",
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
    <>
      <div className={cn("datepicker-box")}>
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
        <div
          className={cn("datepicker-wrapper", "group relative")}
          ref={wrapRef}
        >
          <ReactDatePicker
            onCalendarClose={onCalendarClose}
            selected={value}
            onChange={onChange}
            dateFormat={dateFormat}
            className={cn(
              "datepicker",
              "w-full h-full outline-none rounded-md px-3 text-base font-semibold text-textSecondary duration-200 border border-solid border-borderSecondary placeholder:font-normal",
              {
                "focus:border focus:border-solid focus:border-borderBrand focus:shadow-[0px_0px_0px_4px_#9e77ed3d,0px_1px_2px_0px_#1018280d]":
                  !error,
                "border-borderErrorSolid": !!error,
              },
            )}
            popperClassName={cn(
              "poper-datepicker",
              "!fixed invisible !z-50",
              idAsClassName,
            )}
            locale={"en-US"}
            formatWeekDay={(day) =>
              weekDayMapping[day as keyof typeof weekDayMapping]
            }
            autoComplete="off"
            id={id || _id}
            placeholderText={placeholder || "Chọn ngày/tháng/năm"}
            onFocus={() => {
              setTimeout(updateDropdownPosition);
            }}
            renderCustomHeader={(params) => {
              return (
                <>
                  <div
                    className={cn(
                      "popup-header",
                      "flex items-center justify-between font-semibold text-textSecondary text-base",
                    )}
                  >
                    <button
                      onClick={params.decreaseMonth}
                      className="block border-none p-md duration-200 rounded-full hover:bg-bgSecondary"
                    >
                      <ChevronLeftIcon className="block" />
                    </button>
                    {moment(params.monthDate).format("MMMM yyyy")}
                    <button
                      onClick={params.increaseMonth}
                      className="block border-none p-md duration-200 rounded-full hover:bg-bgSecondary"
                    >
                      <ChevronRightIcon className="block" />
                    </button>
                  </div>
                  <div
                    className={cn("today", "my-lg flex items-center gap-lg")}
                  >
                    <span
                      className={cn(
                        "label",
                        "h-xl5 flex items-center grow border border-solid border-borderPrimary rounded-md px-3 text-base text-textPrimary shadow-[0px_1px_2px_0px_#1018280d]",
                      )}
                    >
                      {moment().format("D MMMM, yyyy")}
                    </span>
                    <Button
                      className={cn("get-today-btn", "w-fit px-md")}
                      size="md"
                      onClick={() => onChange(new Date())}
                    >
                      Today
                    </Button>
                  </div>
                </>
              );
            }}
            ref={ref}
          />

          <label
            className={cn(
              "calendar-icon",
              "absolute cursor-pointer top-1/2 right-lg -translate-y-1/2 block p-xxs text-[#98a2b3] group-hover:none",
            )}
            htmlFor={id || _id}
          >
            <CalendarIcon className="block" />
          </label>
          <button
            className={cn(
              "clear-btn",
              "border-none hidden absolute top-1/2 right-lg -translate-y-1/2",
              "group-hover:block",
            )}
            onClick={() => onChange(null)}
          >
            <CloseFilledIcon className="block" />
          </button>
        </div>
        <div
          className={cn(
            "error-message",
            "overflow-hidden duration-200 text-textErrorPrimary text-sm text-right",
          )}
          style={{
            height: errorHeight,
          }}
        >
          <p ref={errorRef}>{error}</p>
        </div>
      </div>
    </>
  );
}
