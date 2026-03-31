"use client";

import { CalendarEvent, EVENT_COLORS } from "@/lib/types";

interface EventCardProps {
  event: CalendarEvent;
  onClose: () => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventCard({ event, onClose }: EventCardProps) {
  const accentColor = event.type
    ? EVENT_COLORS[event.type]
    : "#9CA3AF";

  const hasTime = event.date.start.includes("T");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-1.5" style={{ backgroundColor: accentColor }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {event.type && (
                <span
                  className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-2"
                  style={{
                    color: accentColor,
                    backgroundColor: `${accentColor}15`,
                  }}
                >
                  {event.type}
                </span>
              )}
              <h2 className="text-xl font-semibold text-gray-900">{event.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 6L14 14M14 6L6 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <svg
                className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 4.5V8L10.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-gray-900 font-medium">{formatDate(event.date.start)}</p>
                {hasTime && (
                  <p className="text-gray-500">
                    {formatTime(event.date.start)}
                    {event.date.end && ` \u2013 ${formatTime(event.date.end)}`}
                  </p>
                )}
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 14S3 9.5 3 6.5C3 3.46 5.24 1 8 1s5 2.46 5 5.5C13 9.5 8 14 8 14z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <circle cx="8" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <p className="text-gray-600">{event.location}</p>
              </div>
            )}

            {event.description && (
              <div className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path d="M3 4H13M3 8H10M3 12H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            )}

            {event.participants && (
              <div className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="M2 14c0-2.76 2.69-5 6-5s6 2.24 6 5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-gray-600">{event.participants}</p>
              </div>
            )}

            {event.audience.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                {event.audience.map((a) => (
                  <span
                    key={a}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          {event.lumaUrl && (
            <a
              href={event.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: accentColor }}
            >
              RSVP on Luma
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7H11M8 4L11 7L8 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
