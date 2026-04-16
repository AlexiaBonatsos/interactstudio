import Calendar from "@/components/Calendar";

export const revalidate = 60;

export default function PublicPage() {
  return (
    <main className="flex-1">
      <Calendar publicOnly />
    </main>
  );
}
