import {
  useEffect,
  useId,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { toLatinDigits } from "@/shared/lib/digits";

export interface OtpFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  digitLabel: string;
  required?: boolean;
  length?: number;
  disabled?: boolean;
}

export default function OtpField({
  id: providedId,
  label,
  value,
  onChange,
  error,
  hint,
  digitLabel,
  required = false,
  length = 6,
  disabled = false,
}: OtpFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const pendingFocus = useRef<number | undefined>(undefined);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  useEffect(() => {
    if (pendingFocus.current === undefined) return;
    refs.current[pendingFocus.current]?.focus();
    pendingFocus.current = undefined;
  }, [value]);

  const setDigits = (startIndex: number, rawValue: string) => {
    const entered = toLatinDigits(rawValue).replace(/\D/g, "");
    if (!entered) return;
    const next = [...digits];
    entered.slice(0, length - startIndex).split("").forEach((digit, offset) => {
      next[startIndex + offset] = digit;
    });
    const nextValue = next.join("").slice(0, length);
    pendingFocus.current = Math.min(startIndex + entered.length, length - 1);
    onChange(nextValue);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        refs.current[index - 1]?.focus();
      }
      onChange(next.join(""));
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDigits(0, event.clipboardData.getData("text"));
  };

  return (
    <fieldset
      aria-labelledby={labelId}
      aria-describedby={error || hint ? messageId : undefined}
      aria-invalid={Boolean(error)}
    >
      <legend
        id={labelId}
        className="m3-label-large mb-2 text-m3-on-surface"
      >
        {label}
        {required && (
          <span className="ms-1 text-m3-error" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="grid grid-cols-6 gap-1.5" dir="ltr">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              refs.current[index] = element;
            }}
            id={index === 0 ? id : undefined}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={index === 0 ? length : 1}
            value={digit}
            disabled={disabled}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`${digitLabel} ${index + 1}`}
            aria-invalid={Boolean(error)}
            className="aspect-square min-h-11 min-w-0 rounded-m3-md border border-m3-outline bg-m3-surface p-0 text-center text-lg font-medium text-m3-on-surface shadow-none transition focus:border-m3-primary focus:ring-4 focus:ring-m3-primary/15 aria-[invalid=true]:border-m3-error aria-[invalid=true]:focus:ring-m3-error/15 disabled:cursor-not-allowed disabled:opacity-60"
            onChange={(event) => {
              const nextValue = event.target.value;
              if (!nextValue) {
                const next = [...digits];
                next[index] = "";
                onChange(next.join(""));
                return;
              }
              setDigits(index, nextValue);
            }}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => {
              if (index > value.length) {
                refs.current[Math.min(value.length, length - 1)]?.focus();
                return;
              }
              event.currentTarget.select();
            }}
          />
        ))}
      </div>
      {(error || hint) && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={`mt-2 text-xs leading-relaxed ${
            error ? "text-m3-error" : "text-m3-on-surface-variant"
          }`}
        >
          {error ?? hint}
        </p>
      )}
    </fieldset>
  );
}
