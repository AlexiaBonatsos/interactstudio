"use client";

import { useState, useEffect, useMemo } from "react";
import { CalendarEvent, EVENT_COLORS, EVENT_BG_COLORS, EventType } from "@/lib/types";
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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    return Array.from({ length: remaining }, (_, i) => new Date(year, month + 1, i + 1));
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

  const today = new Date();

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
    <div className="min-h-screen bg-white">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={() => goTo("prev")}
        onNextMonth={() => goTo("next")}
        onToday={() => setCurrentDate(new Date())}
      />

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="px-6 py-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider py-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            className={`grid grid-cols-7 transition-all duration-150 ${
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

              return (
                <div
                  key={i}
                  className={`min-h-[120px] border-t border-gray-100 p-1.5 ${
                    !isCurrentMonth ? "bg-gray-50/50" : ""
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${
                        isToday
                          ? "bg-red-500 text-white font-semibold"
                          : isCurrentMonth
                          ? "text-gray-900"
                          : "text-gray-300"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => {
                      const color = event.type
                        ? EVENT_COLORS[event.type]
                        : "#9CA3AF";
                      const bgColor = event.type
                        ? EVENT_BG_COLORS[event.type]
                        : "rgba(156,163,175,0.15)";

                      return (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className="w-full text-left px-1.5 py-0.5 rounded-md text-[11px] font-medium truncate transition-all hover:opacity-80 active:scale-[0.98]"
                          style={{
                            color,
                            backgroundColor: bgColor,
                          }}
                        >
                          {event.date.start.includes("T") && (
                            <span className="opacity-70 mr-0.5">
                              {new Date(event.date.start).toLocaleTimeString(
                                "en-US",
                                { hour: "numeric", minute: "2-digit", hour12: true }
                              ).replace(" ", "")}{" "}
                            </span>
                          )}
                          {event.name}
                        </button>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <p className="text-[10px] text-gray-400 text-center">
                        +{dayEvents.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile list view */}
          <div className="mt-8 md:hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Events</h2>
            <div className="space-y-2">
              {events
                .filter((e) => {
                  if (!e.date.start) return false;
                  const d = parseEventDate(e.date.start);
                  return d >= new Date(year, month, 1) && d <= new Date(year, month + 1, 0);
                })
                .map((event) => {
                  const color = event.type
                    ? EVENT_COLORS[event.type]
                    : "#9CA3AF";

                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <div
                        className="w-1 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.date.start).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          {event.date.start.includes("T") &&
                            ` at ${new Date(event.date.start).toLocaleTimeString(
                              "en-US",
                              { hour: "numeric", minute: "2-digit" }
                            )}`}
                        </p>
                      </div>
                      {event.type && (
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                          style={{ color, backgroundColor: `${color}15` }}
                        >
                          {event.type}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <EventCard
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
