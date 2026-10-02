import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/supabase/auth";

export async function GET(request) {
  const { supabase, response } = await getAuthenticatedAdmin();

  if (response) {
    return response;
  }

  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("season");

  const { data, error: dbError } = await supabase
    .from("episode")
    .select("id, number, title, esFinal, esFinalDraga")
    .eq("season_id", seasonId)
    .order("number", { ascending: true });
  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
