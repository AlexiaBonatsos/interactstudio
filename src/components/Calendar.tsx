"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CalendarEvent,
  EVENT_COLORS,
  EVENT_BG_COLORS,
  EVENT_DOT_COLORS,
  EventType,
} from "@/lib/types";
import CalendarHeader from "./CalendarHeader";
import EventCard from "./EventCard";

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseEventDate(dateStr: string): Date {
  if (dateStr.includes("T")) {
    return new Date(dateStr);
  }
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function splitEventName(name: string): [string, string] | null {
  const dashIdx = name.indexOf(" - ");
  if (dashIdx !== -1) return [name.slice(0, dashIdx), name.slice(dashIdx + 3)];
  const colonIdx = name.indexOf(": ");
  if (colonIdx !== -1) return [name.slice(0, colonIdx), name.slice(colonIdx + 2)];
  return null;
}

const WEEKDAYS_FULL = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

const ALL_EVENT_TYPES: EventType[] = [
  "Foundations",
  "Studio",
  "Salon",
  "Open Studio",
  "Writing",
  "Live Model",
  "Chapter",
];

const GCAL_SUBSCRIBE_URL =
  "https://calendar.google.com/calendar/r?cid=c_05d797da846c29fda2fd6d72ebea91a4e828dc31562914050c40319074eae47b@group.calendar.google.com";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const startDay = days[0].getDay();

  const prevMonthDays = useMemo(() => {
    const prev = new Date(year, month, 0);
    const result: Date[] = [];
    for (let i = startDay - 1; i >= 0; i--) {
      result.push(new Date(year, month - 1, prev.getDate() - i));
    }
    return result;
  }, [year, month, startDay]);

  const totalCells = prevMonthDays.length + days.length;
  const nextMonthDays = useMemo(() => {
    const remaining = 7 - (totalCells % 7);
    if (remaining === 7) return [];
    return Array.from(
      { length: remaining },
      (_, i) => new Date(year, month + 1, i + 1)
    );
  }, [year, month, totalCells]);

  const allDays = [...prevMonthDays, ...days, ...nextMonthDays];

  function getEventsForDay(day: Date): CalendarEvent[] {
    return events.filter((e) => {
      if (!e.date.start) return false;
      const start = parseEventDate(e.date.start);
      if (e.date.end) {
        const end = parseEventDate(e.date.end);
        return day >= start && day <= end;
      }
      return isSameDay(start, day);
    });
  }

  const upcomingEvents = useMemo(() => {
    const todayStart = startOfDay(today);
    return events
      .filter((e) => {
        if (!e.date.start) return false;
        return parseEventDate(e.date.start) >= todayStart;
      })
      .sort(
        (a, b) =>
          parseEventDate(a.date.start).getTime() -
          parseEventDate(b.date.start).getTime()
      )
      .slice(0, 10);
  }, [events]);

  function goTo(dir: "prev" | "next") {
    setDirection(dir === "prev" ? "right" : "left");
    setTimeout(() => {
      setCurrentDate(
        new Date(year, dir === "prev" ? month - 1 : month + 1, 1)
      );
      setDirection(null);
    }, 150);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F3" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6 md:py-8">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={() => goTo("prev")}
          onNextMonth={() => goTo("next")}
          onToday={() => setCurrentDate(new Date())}
        />

        {loading ? (
          <div className="flex items-center justify-center h-64 md:h-96">
            <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex gap-8 mt-4 md:mt-6">
              {/* Calendar grid */}
              <div className="flex-1 min-w-0">
                {/* Weekday headers — full on desktop, single letter on mobile */}
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS_FULL.map((d, idx) => (
                    <div
                      key={d}
                      className="text-center text-[10px] md:text-xs font-semibold tracking-widest py-2 md:py-3"
                      style={{ color: "#8B8580" }}
                    >
                      <span className="hidden md:inline">{d}</span>
                      <span className="md:hidden">{WEEKDAYS_SHORT[idx]}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div
                  className={`grid grid-cols-7 border border-[#E8E0D8] rounded-xl overflow-hidden transition-all duration-150 ${
                    direction === "left"
                      ? "-translate-x-2 opacity-0"
                      : direction === "right"
                      ? "translate-x-2 opacity-0"
                      : "translate-x-0 opacity-100"
                  }`}
                >
                  {allDays.map((day, i) => {
                    const isCurrentMonth = day.getMonth() === month;
                    const isToday = isSameDay(day, today);
                    const dayEvents = getEventsForDay(day);
                    const hasEvent = dayEvents.length > 0;
                    const firstEvent = dayEvents[0];

                    const cellBg = isCurrentMonth ? "#FFFFFF" : "#FAF6F1";

                    return (
                      <div
                        key={i}
                        className={`
                          min-h-[52px] md:min-h-[260px]
                          border-r border-b border-[#E8E0D8]
                          p-1 md:p-3
                          relative transition-all
                          ${hasEvent ? "cursor-pointer active:scale-[0.97]" : ""}
                          ${i % 7 === 6 ? "border-r-0" : ""}
                          ${i >= allDays.length - 7 ? "border-b-0" : ""}
                        `}
                        style={{ backgroundColor: cellBg }}
                        onClick={() => {
                          if (hasEvent) setSelectedEvent(firstEvent);
                        }}
                      >
                        <span
                          className={`text-xs md:text-sm font-medium block ${
                            isToday
                              ? "inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-white"
                              : ""
                          } ${
                            !isCurrentMonth
                              ? "text-[#C8C0B8]"
                              : hasEvent
                              ? "text-[#4A4540]"
                              : "text-[#6B6560]"
                          }`}
                          style={
                            isToday
                              ? { backgroundColor: "#C47A5A" }
                              : undefined
                          }
                        >
                          {day.getDate()}
                        </span>

                        {/* Desktop: show event names */}
                        {hasEvent && (
                          <div className="hidden md:block mt-1.5 space-y-1">
                            {dayEvents.slice(0, 2).map((event) => {
                              const EventWrapper = event.lumaUrl ? "a" : "button";
                              const wrapperProps = event.lumaUrl
                                ? {
                                    href: event.lumaUrl,
                                    target: "_blank" as const,
                                    rel: "noopener noreferrer",
                                  }
                                : {};
                              const nameColor = event.type
                                ? EVENT_COLORS[event.type]
                                : "#4A4540";
                              const nameParts = splitEventName(event.name);

                              return (
                                <EventWrapper
                                  key={event.id}
                                  {...wrapperProps}
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    if (!event.lumaUrl) setSelectedEvent(event);
                                  }}
                                  className="w-full text-left block hover:underline"
                                >
                                  {nameParts ? (
                                    <>
                                      <p
                                        className="text-[10px] leading-tight"
                                        style={{ color: "#A09890" }}
                                      >
                                        {nameParts[0]}
                                      </p>
                                      <p
                                        className="text-sm md:text-[16px] font-bold leading-snug break-words"
                                        style={{ color: nameColor }}
                                      >
                                        {nameParts[1]}
                                      </p>
                                    </>
                                  ) : (
                                    <p
                                      className="text-sm md:text-[16px] font-bold leading-snug break-words"
                                      style={{ color: nameColor }}
                                    >
                                      {event.name}
                                    </p>
                                  )}
                                </EventWrapper>
                              );
                            })}
                            {dayEvents.length > 2 && (
                              <p className="text-[10px] font-medium text-[#9B9590]">
                                +{dayEvents.length - 2} more
                              </p>
                            )}
                          </div>
                        )}

                        {/* Mobile: show colored dots */}
                        {hasEvent && (
                          <div className="flex gap-0.5 mt-1 md:hidden justify-center">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                              <div
                                key={idx}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: event.type
                                    ? EVENT_DOT_COLORS[event.type]
                                    : "#A09890",
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop sidebar */}
              <div className="hidden lg:block w-56 shrink-0">
                <div
                  className="rounded-xl p-5 sticky top-8"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E8E0D8",
                  }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{ color: "#8B8580" }}
                  >
                    Event Type
                  </h3>
                  <div className="space-y-3">
                    {ALL_EVENT_TYPES.map((type) => (
                      <div key={type} className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full shrink-0"
                          style={{ backgroundColor: EVENT_DOT_COLORS[type] }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#4A4540" }}
                        >
                          {type}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="my-5"
                    style={{ borderTop: "1px solid #E8E0D8" }}
                  />

                  <a
                    href={GCAL_SUBSCRIBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all hover:brightness-[0.95] active:scale-[0.98]"
                    style={{
                      backgroundColor: "#2D2A26",
                      color: "#FDF8F3",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <rect
                        x="2"
                        y="3"
                        width="14"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M2 7H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M6 1V4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 1V4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Subscribe
                  </a>

                  <p
                    className="text-[10px] text-center mt-3 leading-relaxed"
                    style={{ color: "#A09890" }}
                  >
                    Interact Studio
                    <br />
                    2751 21st Street, SF
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile: subscribe + legend row */}
            <div className="lg:hidden mt-6 flex items-center gap-3 overflow-x-auto pb-2">
              <a
                href={GCAL_SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-wide rounded-lg shrink-0"
                style={{
                  backgroundColor: "#2D2A26",
                  color: "#FDF8F3",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 7H16" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Subscribe
              </a>
              {ALL_EVENT_TYPES.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-1.5 shrink-0"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: EVENT_DOT_COLORS[type] }}
                  />
                  <span
                    className="text-[11px] font-medium whitespace-nowrap"
                    style={{ color: "#6B6560" }}
                  >
                    {type}
                  </span>
                </div>
              ))}
            </div>

            {/* Upcoming events — visible on all screen sizes */}
            {upcomingEvents.length > 0 && (
              <div className="mt-8 md:mt-10">
                <h2
                  className="text-lg md:text-xl font-black uppercase tracking-wide mb-4"
                  style={{ color: "#2D2A26" }}
                >
                  Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {upcomingEvents.map((event) => {
                    const textColor = event.type
                      ? EVENT_COLORS[event.type]
                      : "#4A4540";

                    const CardTag = event.lumaUrl ? "a" : "button";
                    const cardProps = event.lumaUrl
                      ? {
                          href: event.lumaUrl,
                          target: "_blank" as const,
                          rel: "noopener noreferrer",
                        }
                      : {
                          onClick: () => setSelectedEvent(event),
                        };

                    return (
                      <CardTag
                        key={event.id}
                        {...(cardProps as any)}
                        className="flex items-start gap-3 p-4 rounded-xl transition-all hover:scale-[0.99] active:scale-[0.97] text-left border"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E8E0D8",
                        }}
                      >
                        <div
                          className="w-1 shrink-0 rounded-full self-stretch"
                          style={{
                            backgroundColor: event.type
                              ? EVENT_DOT_COLORS[event.type]
                              : "#A09890",
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          {(() => {
                            const nameParts = splitEventName(event.name);
                            if (nameParts) {
                              return (
                                <>
                                  <p
                                    className="text-[10px] truncate"
                                    style={{ color: "#A09890" }}
                                  >
                                    {nameParts[0]}
                                  </p>
                                  <p
                                    className="text-sm font-bold truncate"
                                    style={{ color: textColor }}
                                  >
                                    {nameParts[1]}
                                  </p>
                                </>
                              );
                            }
                            return (
                              <p
                                className="text-sm font-bold truncate"
                                style={{ color: textColor }}
                              >
                                {event.name}
                              </p>
                            );
                          })()}
                          {event.participants && (
                            <p
                              className="text-[10px] mt-0.5 truncate"
                              style={{ color: "#A09890" }}
                            >
                              {event.participants}
                            </p>
                          )}
                          <p
                            className="text-xs mt-1 font-medium"
                            style={{ color: "#8B8580" }}
                          >
                            {new Date(event.date.start).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                            {event.date.start.includes("T") &&
                              ` at ${new Date(
                                event.date.start
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}`}
                          </p>
                          {event.location && (
                            <p
                              className="text-[11px] mt-0.5 truncate"
                              style={{ color: "#A09890" }}
                            >
                              {event.location}
                            </p>
                          )}
                        </div>
                        {event.type && (
                          <span
                            className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                            style={{
                              color: textColor,
                              border: `1px solid ${textColor}25`,
                            }}
                          >
                            {event.type}
                          </span>
                        )}
                      </CardTag>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {selectedEvent && (
          <EventCard
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
}
