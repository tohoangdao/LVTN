import {
  KeyboardEvent,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import useResize from "@/hooks/useResize";

import CheckIcon from "@/assets/check.svg";
import CheveronDownIcon from "@/assets/chevron-down.svg";
import PlusIcon from "@/assets/plus.svg";
import CloseIcon from "@/assets/x-close.svg";

import DropDown from "./Dropdown";
import Menu from "./Menu";
import Button from "./Button";
import Input from "./Input";
import NoData from "./NoData";
import LoadingComponent from "@/components/main/LoadingComponent";
import cn from "@/utils/tw-merge";
import { reactNodeToString } from "@/utils/string-utils";

interface Props<T extends string> {
  options: {
    value: T;
    label: ReactNode;
    searchValue?: string | string[];
  }[];
  value: T | T[];
  className?: string;
  valueSelectedClassName?: string;
  label?: ReactNode;
  arrowIcon?: ReactNode | null;
  placeholder?: string;
  addLabel?: ReactNode;
  prefix?: ReactNode;
  mode?: "multi" | "normal";
  preventSearchAction?: boolean;
  error?: string;
  enterToSelect?: boolean;
  keepSearchOnBlur?: boolean;
  searchValue?: string;
  onChange: (value: T | T[]) => void;
  onAdd?: (label: string) => void;
  renderItemMultiMode?: (props: {
    className: string;
    value: T;
    label: ReactNode;
    onClose: () => void;
  }) => ReactNode;
  onSearchChange?: (search: string) => void;
  onEnter?: (e: KeyboardEvent) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function Select<T extends string>({
  options,
  value,
  className,
  label,
  arrowIcon,
  placeholder,
  addLabel,
  prefix,
  mode = "normal",
  preventSearchAction,
  error,
  enterToSelect = true,
  keepSearchOnBlur = false,
  searchValue: _searchValue,
  onChange,
  onAdd,
  renderItemMultiMode,
  onSearchChange,
  onEnter,
  loading,
  disabled,
  valueSelectedClassName,
}: Props<T>) {
  const [active, setActive] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addLabelValue, setLabelValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentSelected, setCurrentSelected] = useState<number | null>(null);
  const [errorHeight, setErrorHeight] = useState(0);

  const id = useId();
  const listValueIdAsClass = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (searchValue && enterToSelect) setCurrentSelected(0);
    else setCurrentSelected(null);
  }, [searchValue]);

  useEffect(() => {
    setSearchValue(_searchValue || "");
  }, [_searchValue]);

  useResize(errorRef, () => {
    setErrorHeight(errorRef.current?.offsetHeight || 0);
  }, []);

  const filteredOptions = useMemo(() => {
    if (preventSearchAction) return options;
    return options.filter((option) => {
      return (
        option.searchValue?.includes(searchValue) ||
        (option.label && reactNodeToString(option.label).includes(searchValue))
      );
    });
  }, [searchValue, options]);

  const handleClickOption = (_value: T) => {
    if (mode === "multi") {
      if (Array.isArray(value)) {
        if (value.includes(_value)) onChange(value.filter((v) => v !== _value));
        else onChange([...value, _value]);
      }
    } else {
      if (value !== _value) {
        onChange(_value);
      }
      setActive(false);
    }
  };

  const handleActiveChange = (_active: boolean) => {
    setActive(_active);
    if (adding) {
      setAdding(false);
      setLabelValue("");
    }
    if (!_active && !keepSearchOnBlur) {
      setSearchValue("");
      searchRef.current?.blur();
    }
  };

  const handleAddBtnClick = () => {
    setAdding(true);

    setTimeout(() => {
      const input = document.getElementById(id) as HTMLInputElement | undefined;
      input?.focus();
    }, 0);
  };

  const handleAddInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onAdd!(addLabelValue.trim());
    }

    if (e.key === "Escape") {
      setAdding(false);
      setLabelValue("");
    }
  };

  const handleDeleteSelected = (_value: T) => {
    onChange((value as T[]).filter((v) => v !== _value));
  };

  const handleTrigger = (e: MouseEvent, currentShow: boolean) => {
    const items = document.getElementsByClassName(listValueIdAsClass);
    const allow = Array.from(items).every(
      (element) => !element.contains(e.target as Node),
    );

    if (allow) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    }

    if (currentShow) return false;
    return allow;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (filteredOptions.length && typeof currentSelected === "number") {
      if (e.key === "ArrowDown") {
        if (currentSelected < filteredOptions.length - 1)
          setCurrentSelected((prev) => prev! + 1);
        else setCurrentSelected(0);
      }

      if (e.key === "ArrowUp") {
        if (currentSelected === 0)
          setCurrentSelected(filteredOptions.length - 1);
        else setCurrentSelected((prev) => prev! - 1);
      }

      if (e.key === "Enter") {
        handleClickOption(filteredOptions[currentSelected!].value);
      }
    }
    if (e.key === "Enter" && onEnter) {
      onEnter(e);
      setActive(false); // close the dropdown when user hit "Enter"
    }
  };

  const renderContent = () => {
    if (mode === "multi")
      return (
        <div
          className={cn(
            "select-multi-box",
            "flex items-center min-h-[44px] py-xs px-3 gap-sm bg-bgPrimary rounded-md duration-200 border border-solid border-borderSecondary hover:shadow-[0px_1px_2px_0px_#1018280d]",
            {
              "boder border-solid border-borderBrand shadow-[0px_0px_0px_4px_#9e77ed3d,_0px_1px_2px_0px_#1018280d]":
                active,
              "border-borderErrorSolid": !!error,
            },
          )}
        >
          {prefix && <div className={cn("prefix")}>{prefix}</div>}
          <div
            className={cn(
              "select-multi-values",
              "flex items-center flex-wrap gap-sm",
            )}
          >
            {Array.isArray(value)
              ? value.length
                ? value.map((_value) =>
                    renderItemMultiMode ? (
                      renderItemMultiMode({
                        ...options.find((option) => option.value === _value)!,
                        className: cn(
                          "value-item",
                          "flex items-center gap-xs border border-solid border-borderPrimary rounded-sm text-sm font-medium text-textSecondary p-xs",
                          listValueIdAsClass,
                        ),

                        onClose: () => handleDeleteSelected(_value),
                      })
                    ) : (
                      <div
                        key={_value}
                        className={cn(
                          "value-item",
                          "flex items-center gap-xs bg-utilityBlue50 border border-solid border-utilityBrand600 rounded-full text-xs font-medium text-utilityBrand700 p-xs",
                          listValueIdAsClass,
                        )}
                      >
                        {
                          options.find((option) => option.value === _value)
                            ?.label
                        }
                        <button
                          className={cn(
                            "delete-item-btn",
                            "p-xxs rounded-sm duration-200 block border-none hover:bg-bgSecondary",
                          )}
                          onClick={() => handleDeleteSelected(_value)}
                        >
                          <CloseIcon className="block" />
                        </button>
                      </div>
                    ),
                  )
                : !active && (
                    <span className={cn("placeholder", "text-textPlaceholder")}>
                      {placeholder}
                    </span>
                  )
              : "Value must be an Array"}
            <input
              value={searchValue}
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  setSearchValue(e.target.value);
                  onSearchChange && onSearchChange(e.target.value);
                }
              }}
              ref={searchRef}
              className={cn(
                "select-search",
                "border-none outline-none w-fit block min-w-[30px] max-w-full text-base",
              )}
              style={{
                width: (searchValue || placeholder || "").length + 6 + "ch",
              }}
              placeholder={active && value?.length === 0 ? placeholder : ""}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      );
    return (
      <Button
        className={cn(
          "select-btn",
          "justify-between font-medium text-textPrimary border border-solid border-borderSecondary px-4 hover:translate-x-0 hover:translate-y-0 overflow-hidden",
          {
            "border border-solid border-borderBrand shadow-[0px_0px_0px_4px_#9e77ed3d,_0px_1px_2px_0px_#1018280d]":
              !error && active,
            "border-borderErrorSolid": !!error,
          },
        )}
        disabled={disabled}
      >
        <div
          className={cn(
            "prefix-container",
            "flex gap-x-md items-center flex-1",
          )}
        >
          {prefix}
          <input
            value={searchValue}
            onChange={(e) => {
              if (!e.target.value.startsWith(" ")) {
                setSearchValue(e.target.value);
                onSearchChange && onSearchChange(e.target.value);
              }
            }}
            ref={searchRef}
            className={cn(
              "select-search",
              "border-none outline-none w-fit block min-w-[30px] max-w-full text-base",
              "hidden",
              {
                block: active,
              },
            )}
            style={{
              width:
                (
                  options
                    .find((option) => option.value === value)
                    ?.label?.toString() ||
                  searchValue ||
                  placeholder ||
                  ""
                ).length +
                // 6 +  //fix width suddenly move to the left when click on the input
                "ch",
            }}
            placeholder={
              (!!options.length &&
                typeof options[0].label !== "object" &&
                options
                  .find((option) => option.value === value)
                  ?.label?.toString()) ||
              (active && value?.length === 0 ? placeholder : "")
            }
            onKeyDown={handleKeyDown}
          />
          <div
            className={cn("value-selected", valueSelectedClassName, {
              hidden: active,
            })}
          >
            {options.find((option) => option.value === value)?.label || (
              <span
                className={cn("select-placeholder", "text-textPlaceholder", {
                  hidden: active,
                })}
              >
                {keepSearchOnBlur ? searchValue : placeholder || "Select"}
              </span>
            )}
          </div>
        </div>
        {arrowIcon !== null &&
          (arrowIcon || (
            <span className={cn("arow-icon", "block text-textQuaternary")}>
              <CheveronDownIcon className="block" />
            </span>
          ))}
      </Button>
    );
  };

  return (
    <div className={cn("select-wrap", "relative", className)}>
      {label && (
        <label
          className={cn(
            "label-select",
            "text-base font-medium text-textSecondary inline-block pb-sm",
            { "text-textErrorPrimary": !!error },
          )}
        >
          {label}
        </label>
      )}
      <div className={cn("select-box")}>
        <DropDown
          active={active}
          content={
            <>
              {loading && (
                <div className={cn("loading-wrapper", "py-xl2")}>
                  <LoadingComponent />
                </div>
              )}
              {!loading && (
                <div
                  className={cn(
                    "select-menu-wrap",
                    "overflow-auto max-h-[260px]",
                  )}
                >
                  {filteredOptions.length ? (
                    <Menu
                      menus={filteredOptions.map((option, index) => ({
                        label: (
                          <>
                            {option.label}
                            {((Array.isArray(value) &&
                              value.includes(option.value)) ||
                              option.value === value) && (
                              <CheckIcon className="text-[#032A94]" />
                            )}
                          </>
                        ),
                        wrapClassName: cn("select-item", "!border-t-0"),
                        className: cn(
                          "select-item-label",
                          "flex justify-between items-center font-medium !text-textSecondary !py-3 !px-md leading-4",
                          "hover:!bg-bgSecondary",
                          {
                            "!bg-bgSecondary": Array.isArray(value)
                              ? value.includes(option.value)
                              : value === option.value,
                            "!bg-bgQuaternary": index === currentSelected,
                          },
                        ),
                        onClick: () => handleClickOption(option.value),
                      }))}
                      className={cn("select-menu", "border-none")}
                    />
                  ) : (
                    <NoData />
                  )}

                  <div className={cn("select-add-wrap", "p-xs")}>
                    {adding && (
                      <Input
                        value={addLabelValue}
                        id={id}
                        onChange={(e) => {
                          if (!e.target.value.startsWith(" "))
                            setLabelValue(e.target.value);
                        }}
                        onKeyDown={handleAddInputKeyDown}
                        placeholder="Nhấn Enter để xác nhận hoặc ESC để hủy"
                      />
                    )}
                    {onAdd && (
                      <Button
                        type="text"
                        className={cn(
                          "select-add",
                          "text-textBrandSecondary my-0 mx-1 hover:!translate-x-0 hover:!translate-y-0 hover:!bg-bgSecondary",
                          {
                            hidden: adding,
                          },
                        )}
                        onClick={handleAddBtnClick}
                      >
                        <PlusIcon /> {addLabel || "Add"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          }
          trigger="click"
          contentClassName={cn(
            "select-popup",
            "!w-full rounded-md !top-[calc(100%_+_2px)] bg-bgPrimary",
          )}
          contentActiveClassName={cn(
            "select-popup-active",
            "shadow-[0px_4px_6px_-2px_#10182808,_0px_12px_16px_-4px_#10182814]",
          )}
          defaultActive={active}
          onActiveChange={handleActiveChange}
          onTrigger={handleTrigger}
        >
          {renderContent()}
        </DropDown>
        <div
          className={cn(
            "error-message",
            "text-right text-sm text-textErrorPrimary duration-200 overflow-hidden",
            "absolute right-0 top-full",
          )}
          style={{
            height: errorHeight,
          }}
        >
          <p ref={errorRef}>{error}</p>
        </div>
      </div>
    </div>
  );
}
