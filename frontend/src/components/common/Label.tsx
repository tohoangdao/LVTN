import { DetailedHTMLProps, LabelHTMLAttributes } from "react";
import cn from "@/utils/tw-merge";

interface Props
  extends DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

function Label(props: Props) {
  const { children, className, ...rest } = props;

  return (
    <label
      className={cn(
        "label",
        "inline-block text-textSecondary text-base pb-sm font-medium",
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
}

export default Label;
