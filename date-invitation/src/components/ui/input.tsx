import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Rounded text input matching the soft, premium look of the cards. */
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full rounded-2xl border border-bordeaux/10 bg-white/80 px-5",
      "text-base text-bordeaux placeholder:text-bordeaux/40",
      "shadow-inner shadow-bordeaux/5",
      "transition-all duration-300",
      "focus:border-rose/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose/15",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
