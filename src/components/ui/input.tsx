import * as React from "react";

import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/hooks/use-haptic";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onFocus, onTouchStart, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      triggerHaptic(8);
      onFocus?.(e);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
      triggerHaptic(8);
      onTouchStart?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        onFocus={handleFocus}
        onTouchStart={handleTouchStart}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
Input.displayName = "Input";

export { Input };
