import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",

        blue: "bg-blue-500 text-secondary-foreground shadow-sm hover:bg-blue-500/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outlinedestructive:
          "text-destructive border border-destructive hover:text-destructive-foreground shadow hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        outlineprimary:
          "text-primary bg-background border border-primary hover:text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        outlinesecondary:
          "text-secondary border border-secondary hover:text-secondary-foreground shadow hover:bg-secondary/90",
        success:
          "bg-emerald-500 text-secondary-foreground shadow-sm hover:bg-emerald-500/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        normal: "bg-secondary border hover:border-[#000]",
        simple: "text-gray-500 hover:text-accent-foreground",
        sidebaractive:
          "bg-primary/80 text-primary-foreground shadow hover:bg-primary/90",
        sidebar:
          "hover:text-primary-foreground hover:bg-primary/90 focus:text-primary-foreground focus:bg-primary/90",
        sidebarItem:
          "gap-2 !justify-start hover:bg-accent hover:bg-primary/80 hover:text-primary-foreground",
        sidebarActiveItem:
          "gap-2 !justify-start bg-primary/80 hover:bg-primary/90 text-primary-foreground",
        transparent: "hover:text-accent-foreground",
        gradient: "gradient-theme border hover:border-primary",
        gradientDark:
          "gradient-dark border hover:border-primary hover:scale-105",
        gradientLight: "gradient-light border hover:border-primary",
        landingMain: "text-white bg-black hover:bg-white hover:text-black",
        landingOutline:
          "text-white bg-transparent border border-white hover:text-white shadow hover:bg-black",
      },

      size: {
        default: "h-9 px-4 py-2",
        xxs: "h-5 rounded-md p-1 text-xs",
        xs: "h-6 rounded-md p-2 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md py-5 px-10 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
