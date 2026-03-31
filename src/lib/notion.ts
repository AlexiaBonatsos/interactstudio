import { CalendarEvent, EventType } from "./types";

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export async function getEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        sorts: [{ property: "Date", direction: "ascending" }],
      }),
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Notion API error:", await res.text());
    return [];
  }

  const data = await res.json();

  return data.results.map((page: any) => {
    const props = page.properties;

    return {
      id: page.id,
      name: props.Name?.title?.[0]?.plain_text ?? "Untitled",
      date: {
        start: props.Date?.date?.start ?? "",
        end: props.Date?.date?.end ?? null,
      },
      type: (props.Type?.select?.name as EventType) ?? null,
      description: props.Description?.rich_text?.[0]?.plain_text ?? null,
      location: props.Location?.select?.name ?? null,
      audience: props.Audience?.multi_select?.map((s: any) => s.name) ?? [],
      category: props.Category?.select?.name ?? null,
      participants: props.Participants?.rich_text?.[0]?.plain_text ?? null,
      lumaUrl: props["Luma URL"]?.url ?? null,
      season: props.Season?.select?.name ?? null,
    };
  });
}
