import React from "react";

export default function Heading({ level = 1, style, children, ...props }) {
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`;
  const resetStyle = {
    margin: 0,
    padding: 0,
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    color: "inherit",
    ...style,
  };
  return (
    <Tag style={resetStyle} {...props}>
      {children}
    </Tag>
  );
}
