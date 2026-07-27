import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 select-none",
    "rounded-full font-semibold whitespace-nowrap",
    "transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-br from-rose to-bordeaux text-white",
          "shadow-lg shadow-rose/30",
          "hover:shadow-xl hover:shadow-rose/40 hover:brightness-105",
          "active:brightness-95",
        ],
        soft: [
          "glass text-bordeaux shadow-sm shadow-bordeaux/10",
          "hover:bg-white hover:shadow-md hover:shadow-bordeaux/15",
        ],
        ghost: ["text-bordeaux/70 hover:bg-bordeaux/5 hover:text-bordeaux"],
      },
      size: {
        default: "h-12 px-7 text-base",
        lg: "h-14 px-9 text-lg",
        sm: "h-10 px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/** Base button — premium pill shape, three variants, three sizes. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
