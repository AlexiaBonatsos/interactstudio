import { NextResponse } from "next/server";
import { getEvents } from "@/lib/notion";

export const revalidate = 60;

export async function GET() {
  const events = await getEvents();
  return NextResponse.json(events);
}
