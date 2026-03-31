export interface CalendarEvent {
  id: string;
  name: string;
  date: {
    start: string;
    end: string | null;
  };
  type: EventType | null;
  description: string | null;
  location: string | null;
  audience: string[];
  category: string | null;
  participants: string | null;
  lumaUrl: string | null;
  season: string | null;
}

export type EventType =
  | "Foundations"
  | "Studio"
  | "Salon"
  | "Open Studio"
  | "Writing"
  | "Live Model"
  | "Chapter";

export const EVENT_COLORS: Record<EventType, string> = {
  Foundations: "#F472B6",
  Studio: "#60A5FA",
  Salon: "#A78BFA",
  "Open Studio": "#9CA3AF",
  Writing: "#FBBF24",
  "Live Model": "#34D399",
  Chapter: "#4ADE80",
};

export const EVENT_BG_COLORS: Record<EventType, string> = {
  Foundations: "rgba(244,114,182,0.15)",
  Studio: "rgba(96,165,250,0.15)",
  Salon: "rgba(167,139,250,0.15)",
  "Open Studio": "rgba(156,163,175,0.15)",
  Writing: "rgba(251,191,36,0.15)",
  "Live Model": "rgba(52,211,153,0.15)",
  Chapter: "rgba(74,222,128,0.15)",
};
