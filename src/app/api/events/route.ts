import { NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/notion";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const events = await getEvents();
  const isPublic = request.nextUrl.searchParams.get("public") === "true";
  const filtered = isPublic
    ? events.filter((e) => !e.audience.includes("Private"))
    : events;
  return NextResponse.json(filtered);
}
