import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
  trailing?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon,
  trailing,
}: PageHeaderProps) {
  return (
    <header className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-[40px] font-medium text-ink tracking-[-1.0px] mb-2 flex items-center gap-3">
          {icon}
          {title}
        </h1>
        <p className="text-muted font-medium">{description}</p>
      </div>
      {trailing}
    </header>
  );
}
