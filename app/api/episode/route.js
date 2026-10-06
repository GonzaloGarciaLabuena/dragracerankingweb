import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  getAuthenticatedAdmin,
} from "@/lib/supabase/auth";

export async function GET(request) {
  const { supabase, user, error: authError } = await getAuthenticatedUser();

  if (!user) {
    return Response.json({ error: authError.message }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("season");

  const { data, error: dbError } = await supabase
    .from("episode")
    .select(
      `
            id,
            number,
            title,
            esFinal,
            esFinalDraga,
            ppe_reference!inner(id)
        `,
    )
    .eq("season_id", seasonId)
    .order("number", { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}