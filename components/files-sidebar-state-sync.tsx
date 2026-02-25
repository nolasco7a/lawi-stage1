"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { useEffect } from "react";

export function FilesSidebarStateSync() {
  const { open } = useSidebar();
  const { setFilesSidebarOpen } = useSettingsStore();

  useEffect(() => {
    setFilesSidebarOpen(open);
  }, [open, setFilesSidebarOpen]);

  return null;
}
