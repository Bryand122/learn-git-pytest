import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Glassmorphism card with a soft top light. Deliberately no
 * overflow:hidden so playful children (the fleeing button) can
 * travel outside its bounds.
 */
export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass card-light rounded-[2rem]",
        "shadow-[0_24px_70px_-24px_rgb(142_59_87/0.28)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
