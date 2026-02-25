"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { useEffect } from "react";

export function SidebarStateSync() {
  const { open } = useSidebar();
  const { setMainSidebarOpen } = useSettingsStore();

  useEffect(() => {
    setMainSidebarOpen(open);
  }, [open, setMainSidebarOpen]);

  return null;
}
