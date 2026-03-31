import Calendar from "@/components/Calendar";

export const revalidate = 60;

export default function Home() {
  return (
    <main className="flex-1">
      <Calendar />
    </main>
  );
}
