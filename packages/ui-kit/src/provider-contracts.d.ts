import type * as React from "react";

declare global {
  type PolymorphicRef<C extends React.ElementType> =
    React.ComponentPropsWithRef<C>["ref"];

  type AsProp<C extends React.ElementType> = { as?: C };

  type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

  type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = Omit<
    React.PropsWithChildren<AsProp<C>>,
    keyof Props
  > &
    Props &
    Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

  type PolymorphicComponentPropWithRef<
    C extends React.ElementType,
    Props = {}
  > = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };
}

export {};
