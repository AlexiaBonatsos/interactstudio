"use client";

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
  const monthName = currentDate
    .toLocaleDateString("en-US", { month: "long" })
    .toUpperCase();
  const yearStr = currentDate.getFullYear();

  return (
    <header className="flex items-end justify-between pb-2">
      <div>
        <h1
          className="text-5xl font-black tracking-tight leading-none"
          style={{ color: "#2D2A26" }}
        >
          {monthName} {yearStr}
        </h1>
        <p
          className="text-sm font-medium mt-2 tracking-wide"
          style={{ color: "#A09890" }}
        >
          Interact Studio Calendar
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/80"
          style={{ color: "#6B6560" }}
          aria-label="Previous month"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 15L7 10L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={onToday}
          className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          style={{
            color: "#6B6560",
            border: "1.5px solid #D8D0C8",
          }}
        >
          Today
        </button>
        <button
          onClick={onNextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/80"
          style={{ color: "#6B6560" }}
          aria-label="Next month"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M8 5L13 10L8 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
