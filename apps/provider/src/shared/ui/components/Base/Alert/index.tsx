import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import Lucide, {
  type icons,
} from "@/shared/ui/components/Base/Lucide";

export type AlertState = "primary" | "warn" | "error" | "info" | "success";

type IconName = keyof typeof icons;

interface AlertStateStyle {
  icon: IconName;
  color: {
    container: string;
    icon: string;
    title: string;
    action: string;
  };
}

export const alertStateConfig = {
  primary: {
    icon: "Zap",
    color: {
      container:
        "border-m3-primary/30 bg-m3-primary-container/55 text-m3-on-primary-container",
      icon: "bg-m3-primary text-m3-on-primary",
      title: "text-m3-primary dark:text-m3-on-primary-container",
      action: "text-m3-primary dark:text-m3-on-primary-container",
    },
  },
  warn: {
    icon: "AlertTriangle",
    color: {
      container: "border-m3-warning/35 bg-m3-warning/10 text-m3-on-surface",
      icon: "bg-m3-warning text-white dark:text-m3-on-background",
      title: "text-m3-warning",
      action: "text-m3-warning",
    },
  },
  error: {
    icon: "X",
    color: {
      container: "border-m3-error/30 bg-m3-error-container/45 text-m3-on-surface",
      icon: "bg-m3-error text-m3-on-error",
      title: "text-m3-error",
      action: "text-m3-error",
    },
  },
  info: {
    icon: "Info",
    color: {
      container: "border-m3-info/30 bg-m3-info/10 text-m3-on-surface",
      icon: "bg-m3-info text-white dark:text-m3-on-background",
      title: "text-m3-info",
      action: "text-m3-info",
    },
  },
  success: {
    icon: "Check",
    color: {
      container: "border-m3-success/30 bg-m3-success/10 text-m3-on-surface",
      icon: "bg-m3-success text-white dark:text-m3-on-background",
      title: "text-m3-success",
      action: "text-m3-success",
    },
  },
} as const satisfies Record<AlertState, AlertStateStyle>;

export interface AlertAction {
  label: ReactNode;
  href?: string;
  target?: string;
  onClick?: (
    event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
}

export interface AlertProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  state?: AlertState;
  title: ReactNode;
  children?: ReactNode;
  action?: AlertAction;
  dismissible?: boolean;
  durationMs?: number;
  position?: "static" | "fixed";
  onDismiss?: () => void;
  closeLabel?: string;
}

export default function Alert({
  state = "primary",
  title,
  children,
  action,
  dismissible = false,
  durationMs,
  position = "static",
  onDismiss,
  closeLabel,
  className,
  role,
  ...props
}: AlertProps) {
  const { t } = useTranslation("sharedUi");
  const [visible, setVisible] = useState(true);
  const config = alertStateConfig[state];
  const dismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    if (!durationMs || durationMs <= 0) return;
    const timer = window.setTimeout(dismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [dismiss, durationMs]);

  return (
    <Transition
      as={Fragment}
      show={visible}
      enter="transition duration-200 motion-reduce:transition-none"
      enterFrom="translate-y-1 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition duration-150 motion-reduce:transition-none"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-1 opacity-0"
    >
      <div
        {...props}
        role={role ?? (state === "error" ? "alert" : "status")}
        aria-live={state === "error" ? "assertive" : "polite"}
        className={twMerge(
          "relative flex gap-3 overflow-hidden rounded-m3-md border px-4 py-3.5 shadow-none",
          config.color.container,
          position === "fixed" &&
            "fixed left-1/2 top-5 z-[100] w-[min(calc(100%-2rem),34rem)] -translate-x-1/2 shadow-m3-2",
          className,
        )}
      >
        <span
          className={twMerge(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            config.color.icon,
          )}
        >
          <Lucide icon={config.icon} className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={twMerge("font-medium leading-6", config.color.title)}>
            {title}
          </p>
          {children && (
            <div className="mt-0.5 text-sm leading-relaxed opacity-80">
              {children}
            </div>
          )}
          {action && (
            <div className="mt-2">
              {action.href ? (
                <a
                  href={action.href}
                  target={action.target}
                  rel={action.target === "_blank" ? "noreferrer" : undefined}
                  onClick={action.onClick}
                  className={twMerge(
                    "inline-flex min-h-10 items-center rounded-full px-3 text-sm font-medium hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current dark:hover:bg-white/10",
                    config.color.action,
                  )}
                >
                  {action.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={action.onClick}
                  className={twMerge(
                    "inline-flex min-h-10 items-center rounded-full px-3 text-sm font-medium hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current dark:hover:bg-white/10",
                    config.color.action,
                  )}
                >
                  {action.label}
                </button>
              )}
            </div>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            aria-label={closeLabel ?? t("accessibility.close")}
            className="-me-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-m3-on-surface-variant hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current dark:hover:bg-white/10"
            onClick={dismiss}
          >
            <Lucide icon="X" className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </Transition>
  );
}
