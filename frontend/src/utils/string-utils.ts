import React, { ReactNode, ReactElement } from "react";

export function reactNodeToString(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  }

  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (Array.isArray(node)) {
    return node.map(reactNodeToString).join("");
  }

  if (React.isValidElement(node)) {
    const element = node as ReactElement;
    const { type, props } = element;

    // If the element type is a function component, recursively render it
    if (typeof type === "function") {
      // @ts-expect-error ignore this error
      const componentInstance = type(props);
      return reactNodeToString(componentInstance);
    }

    const children = props.children ? reactNodeToString(props.children) : "";

    const propString = Object.keys(props)
      .filter((key) => key !== "children")
      .map((key) => `${key}="${props[key]}"`)
      .join(" ");

    return `<${type}${propString ? " " + propString : ""}>${children}</${type}>`;
  }

  return "";
}
