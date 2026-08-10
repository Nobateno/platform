import {
  forwardRef,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { twMerge } from "tailwind-merge";
import { getPasswordStrength } from "@/shared/lib/validation";
import Lucide from "@/shared/ui/components/Base/Lucide";
import FormField, {
  type FormFieldProps,
} from "@/shared/ui/components/FormField";

type StrengthLabel = "veryWeak" | "weak" | "good" | "strong";

export interface PasswordFieldProps
  extends Omit<FormFieldProps, "type" | "trailing" | "footer"> {
  showLabel: string;
  hideLabel: string;
  capsLockLabel: string;
  strengthLabel: string;
  strengthLabels: Record<StrengthLabel, string>;
  showStrength?: boolean;
}

const strengthColors: Record<StrengthLabel, string> = {
  veryWeak: "bg-m3-error",
  weak: "bg-m3-warning",
  good: "bg-m3-success",
  strong: "bg-m3-success",
};

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      value,
      onChange,
      showLabel,
      hideLabel,
      capsLockLabel,
      strengthLabel,
      strengthLabels,
      showStrength = false,
      onKeyDown,
      onKeyUp,
      onBlur,
      ...props
    },
    ref,
  ) => {
  const [revealed, setRevealed] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const stringValue = typeof value === "string" ? value : "";
  const strength = useMemo(
    () => getPasswordStrength(stringValue),
    [stringValue],
  );
  const visibleLevel = strength.level === "empty" ? undefined : strength.level;

  const updateCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(event.getModifierState("CapsLock"));
  };

  const footer = (
    <>
      {capsLock && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-m3-info">
          <Lucide icon="Info" className="h-4 w-4" aria-hidden="true" />
          {capsLockLabel}
        </p>
      )}
      {showStrength && (
        <div className="mt-3" aria-live="polite">
          <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4].map((segment) => (
              <span
                key={segment}
                className={twMerge(
                  "h-1 rounded-full bg-m3-outline-variant transition-colors",
                  visibleLevel &&
                    segment <= strength.score &&
                    strengthColors[visibleLevel],
                )}
              />
            ))}
          </div>
          <p className="mt-1.5 text-end text-xs text-m3-on-surface-variant">
            {strengthLabel}: {visibleLevel ? strengthLabels[visibleLevel] : "—"}
          </p>
        </div>
      )}
    </>
  );

    return (
      <FormField
        {...props}
        ref={ref}
        type={revealed ? "text" : "password"}
        value={value}
        onChange={onChange}
        onKeyDown={(event) => {
          updateCapsLock(event);
          onKeyDown?.(event);
        }}
        onKeyUp={(event) => {
          updateCapsLock(event);
          onKeyUp?.(event);
        }}
        onBlur={(event) => {
          setCapsLock(false);
          onBlur?.(event);
        }}
        trailing={
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-xs font-medium text-m3-primary hover:bg-m3-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary"
            aria-label={revealed ? hideLabel : showLabel}
            onClick={() => setRevealed((current) => !current)}
          >
            {revealed ? hideLabel : showLabel}
          </button>
        }
        footer={footer}
      />
    );
  },
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
