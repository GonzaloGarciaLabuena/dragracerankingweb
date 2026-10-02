import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function GET(request) {
  const { supabase, user, error: authError } = await getAuthenticatedUser();

  if (!user) {
    return Response.json({ error: authError.message }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");

  let query = supabase
    .from("point_type")
    .select()
    .order("value", { ascending: false });

  if (mode === "final") {
    query = query.eq("esParaFinal", true);
  } else if (mode === "finalDraga") {
    query = query.eq("esParaFinalDraga", true);
  } else {
    query = query.eq("esParaFinal", false);
    query = query.eq("esParaFinalDraga", false);
  }

  const { data, error: dbError } = await query;

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
