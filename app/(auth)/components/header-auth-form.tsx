import React from "react";

interface HeaderAuthFormProps {
  title: string;
  subtitle: string;
}
export default function HeaderAuthForm({ title, subtitle }: HeaderAuthFormProps) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <h3 className="text-2xl font-bold text-contrast">{title}</h3>
      <p className="font-semibold text-sm text-contrast">{subtitle}</p>
    </div>
  );
}
