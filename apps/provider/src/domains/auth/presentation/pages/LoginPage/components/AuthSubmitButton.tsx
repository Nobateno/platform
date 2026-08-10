import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/ui/components/Base/Button";

interface AuthSubmitButtonProps {
  isSubmitting: boolean;
  pendingLabel: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function AuthSubmitButton({
  isSubmitting,
  pendingLabel,
  children,
  className,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="primary"
      rounded
      className={twMerge(
        "mt-6 w-full bg-gradient-to-r from-theme-1/70 to-theme-2/70 py-3.5",
        className,
      )}
      disabled={isSubmitting}
    >
      {isSubmitting ? pendingLabel : children}
    </Button>
  );
}
