"use client";

import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useSettingsStore } from "@/lib/store/settingsStore";

export function FilesSidebarStateSync() {
  const { open } = useSidebar();
  const { setFilesSidebarOpen } = useSettingsStore();

  useEffect(() => {
    setFilesSidebarOpen(open);
  }, [open, setFilesSidebarOpen]);

  return null;
}
