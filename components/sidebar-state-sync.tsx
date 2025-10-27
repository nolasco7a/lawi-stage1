"use client";

import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useSettingsStore } from "@/lib/store/settingsStore";

export function SidebarStateSync() {
  const { open } = useSidebar();
  const { setMainSidebarOpen } = useSettingsStore();

  useEffect(() => {
    setMainSidebarOpen(open);
  }, [open, setMainSidebarOpen]);

  return null;
}
