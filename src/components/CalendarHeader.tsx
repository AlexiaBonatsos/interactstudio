"use client";

const GCAL_SUBSCRIBE_URL =
  "https://calendar.google.com/calendar/r?cid=c_05d797da846c29fda2fd6d72ebea91a4e828dc31562914050c40319074eae47b@group.calendar.google.com";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {monthYear}
        </h1>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12 15L7 10L12 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M8 5L13 10L8 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={onToday}
            className="ml-2 px-3 py-1 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      <a
        href={GCAL_SUBSCRIBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect
            x="2"
            y="3"
            width="14"
            height="13"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M2 7H16" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Subscribe to Calendar
      </a>
    </header>
  );
}
