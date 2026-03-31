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
  Foundations: "#9B2C5E",
  Studio: "#2C5E9B",
  Salon: "#5E2C9B",
  "Open Studio": "#9B5E2C",
  Writing: "#7A6B1E",
  "Live Model": "#2C7A5E",
  Chapter: "#2C7A2C",
};

export const EVENT_BG_COLORS: Record<EventType, string> = {
  Foundations: "#F9D5E5",
  Studio: "#D5E5F9",
  Salon: "#E5D5F9",
  "Open Studio": "#F9E5D5",
  Writing: "#F9F0D5",
  "Live Model": "#D5F9E5",
  Chapter: "#D5F9D5",
};

export const EVENT_DOT_COLORS: Record<EventType, string> = {
  Foundations: "#E8A0C0",
  Studio: "#A0C0E8",
  Salon: "#C0A0E8",
  "Open Studio": "#E8C0A0",
  Writing: "#E8DCA0",
  "Live Model": "#A0E8C0",
  Chapter: "#A0E8A0",
};
