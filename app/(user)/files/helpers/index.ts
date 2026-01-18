export const calculateMarginLeft = (isSidebarOpen: boolean): string => {
  return isSidebarOpen ? "ml-[var(--sidebar-width)]" : "ml-[var(--sidebar-width-icon)]";
};
