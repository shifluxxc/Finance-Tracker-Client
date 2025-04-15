export const CATEGORY_COLOR_MAP: Record<string, string> = {
    "Food & Dining": "#F87171",       // soft red
    "Housing": "#60A5FA",            // soft blue
    "Transportation": "#FBBF24",     // amber
    "Utilities": "#A78BFA",          // violet
    "Entertainment": "#34D399",      // emerald
    "Shopping": "#FB7185",           // rose
    "HealthCare": "#4ADE80",         // green
    "Personal": "#F472B6",           // pink
    "Income": "#38BDF8",             // sky
  };
  
  export const getCategoryColor = (name: string | undefined): string => {
    return CATEGORY_COLOR_MAP[name ?? ""] || "#D1D5DB"; // gray fallback
  };