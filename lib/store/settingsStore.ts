"use client";

import { create } from "zustand";

interface SettingsState {
  mainSidebarOpen: boolean;
  filesSidebarOpen: boolean;
  setMainSidebarOpen: (open: boolean) => void;
  setFilesSidebarOpen: (open: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  mainSidebarOpen: true,
  filesSidebarOpen: true,
  setMainSidebarOpen: (open: boolean) => set({ mainSidebarOpen: open }),
  setFilesSidebarOpen: (open: boolean) => set({ filesSidebarOpen: open }),
}));
