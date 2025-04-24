import { cn } from "@/lib/utils";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1 className={cn("text-3xl font-bold tracking-tight text-foreground md:text-4xl", className)}>
      {children}
    </h1>
  );
}