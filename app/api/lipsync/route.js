import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function GET(request) {
  const { supabase, user, error: authError } = await getAuthenticatedUser();

  if (!user) {
    return Response.json({ error: authError.message }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const episodeId = searchParams.get("episodeId");

  const { data, error: dbError } = await supabase
    .from("lipsync_battle")
    .select()
    .eq("episode_id", episodeId)
    .order("round_number", { ascending: true })
    .order("number", { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
