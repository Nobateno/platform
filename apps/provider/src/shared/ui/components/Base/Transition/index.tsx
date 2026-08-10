"use client";

import { cloneElement, useRef, type ReactElement, type RefObject } from "react";
import ReactTransition from "react-transition-group/Transition";

type EnterHandler = (node: HTMLElement, isAppearing: boolean) => void;
type ExitHandler = (node: HTMLElement) => void;

type SafeTransitionProps = {
  in?: boolean;
  timeout: number | { appear?: number; enter?: number; exit?: number };
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  children: ReactElement;
  onEnter?: EnterHandler;
  onEntering?: EnterHandler;
  onEntered?: EnterHandler;
  onExit?: ExitHandler;
  onExiting?: ExitHandler;
  onExited?: ExitHandler;
};

function Transition({
  children,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  ...transitionProps
}: SafeTransitionProps) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const child = cloneElement(children, { ref: nodeRef } as never);

  return (
    <ReactTransition
      {...transitionProps}
      nodeRef={nodeRef as RefObject<HTMLElement>}
      onEnter={
        onEnter
          ? (isAppearing) => {
              if (nodeRef.current) onEnter(nodeRef.current, isAppearing);
            }
          : undefined
      }
      onEntering={
        onEntering
          ? (isAppearing) => {
              if (nodeRef.current) onEntering(nodeRef.current, isAppearing);
            }
          : undefined
      }
      onEntered={
        onEntered
          ? (isAppearing) => {
              if (nodeRef.current) onEntered(nodeRef.current, isAppearing);
            }
          : undefined
      }
      onExit={
        onExit
          ? () => {
              if (nodeRef.current) onExit(nodeRef.current);
            }
          : undefined
      }
      onExiting={
        onExiting
          ? () => {
              if (nodeRef.current) onExiting(nodeRef.current);
            }
          : undefined
      }
      onExited={
        onExited
          ? () => {
              if (nodeRef.current) onExited(nodeRef.current);
            }
          : undefined
      }
    >
      {child}
    </ReactTransition>
  );
}

export default Transition;
