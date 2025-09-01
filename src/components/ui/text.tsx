import React from "react";

export function H1({
  children,
  ...props
}: React.PropsWithChildren<React.JSX.IntrinsicElements["h1"]>) {
  return (
    <h1
      className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({
  children,
  ...props
}: React.PropsWithChildren<React.JSX.IntrinsicElements["h2"]>) {
  return (
    <h2
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({
  children,
  ...props
}: React.PropsWithChildren<React.JSX.IntrinsicElements["h3"]>) {
  return (
    <h3
      className="scroll-m-20 text-2xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({
  children,
  ...props
}: React.PropsWithChildren<React.JSX.IntrinsicElements["h4"]>) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight" {...props}>
      {children}
    </h4>
  );
}

export function P({
  children,
  ...props
}: React.PropsWithChildren<React.JSX.IntrinsicElements["p"]>) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
      {children}
    </p>
  );
}

export function Small({
  children,
  ...props
}: React.PropsWithChildren<React.JSX.IntrinsicElements["small"]>) {
  return (
    <small className="text-sm leading-none font-medium" {...props}>
      {children}
    </small>
  );
}

export function Muted({
  children,
  ...props
}: React.PropsWithChildren<React.JSX.IntrinsicElements["p"]>) {
  return (
    <p className="text-muted-foreground text-sm" {...props}>
      {children}
    </p>
  );
}
