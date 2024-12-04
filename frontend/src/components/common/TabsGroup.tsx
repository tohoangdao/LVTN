import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import cn from "@/utils/tw-merge";
import Badge from "./Badge";

interface Tab<T> {
  key: T;
  label: ReactNode;
  className?: string;
  badge?: number | string;
  href?: string;
}

interface Props<T> {
  current: T;
  options: Tab<T>[];
  navgateAction?: "replace" | "push";
  className?: string;
  tabClassName?: string;
  activeClassName?: string;
  onChange: (key: T) => void;
}

/**
 * @prop navgateAction default='replace'
 */
export default function TabsGroup<T extends string>({
  current,
  options,
  navgateAction = "replace",
  className,
  tabClassName,
  activeClassName,
  onChange,
}: Props<T>) {
  const router = useRouter();

  const handleTabClick = (tab: Tab<T>) => {
    onChange(tab.key);
    if (tab.href) {
      router[navgateAction](tab.href);
    }
  };
  return (
    <div
      className={cn(
        "tab-switch",
        "flex items-center gap-xs border border-solid border-borderSecondary w-fit bg-bgSecondary rounded-lg",
        className,
      )}
    >
      {options.map((tab) => (
        <button
          key={tab.key}
          className={cn(
            "tab",
            "border-none py-md px-lg rounded-sm text-textQuaternary text-xl font-semibold duration-200 flex items-center justify-center gap-md hover:text-textSecondary min-w-40",
            {
              "bg-bgPrimary shadow-[0px_1px_3px_#1018281a,_0px_1px_2px_#10182814] text-textSecondary cursor-default":
                tab.key === current,
            },
            tabClassName,
            tab.className,
            tab.key === current && activeClassName,
          )}
          onClick={() => handleTabClick(tab)}
        >
          {tab.label}
          {tab.badge !== undefined && <Badge rounded>{tab.badge}</Badge>}
        </button>
      ))}
    </div>
  );
}
