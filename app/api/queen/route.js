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
  const seasonId = searchParams.get("seasonId");

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 20;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("participate")
    .select(
      `
      image_url,
      season: season_id(
        id,
        name,
        franchise,
        esTournament
      ),
      queen: queen_id (
        id,
        name
      ),
      participate_bracket (
        bracket
      )
    `,
      { count: "exact" },
    )
    .order("queen(name)", { ascending: true })
    .range(from, to);

  if (seasonId !== "all") {
    query = query.eq("season_id", seasonId);
  }

  const { data, count, error: dbError } = await query;

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    totalPages: Math.ceil(count / pageSize),
  });
}

export async function POST(request) {
  const { supabase, response } = await getAuthenticatedAdmin();

  if (response) {
    return response;
  }

  const {name, seasonId, image_url, bracket} = await request.json();
  
  const { data, error: dbError } = await supabase.rpc(
    "create_queen_participate",
    {
      p_name: name,
      p_season_id: seasonId,
      p_image_url: image_url,
      p_bracket: bracket
    },
  );

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    exists: !!data,
  });
}

export async function DELETE(request) {
  const { supabase, user, error: authError } = await getAuthenticatedUser();

  if (!user) {
    return Response.json({ error: authError.message }, { status: 401 });
  }

  const body = await request.json();

  const { data, error: dbError } = await supabase
    .from("queen")
    .delete()
    .eq("id", body.id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request) {
  const { supabase, response } = await getAuthenticatedAdmin();

  if (response) {
    return response;
  }

  const body = await request.json();
  const { queenId, queenName } = body;

  if (!queenId) {
    return Response.json({ error: "Queen ID is required" }, { status: 400 });
  }

  if (!queenName) {
    return Response.json({ error: "Queen Name is required" }, { status: 400 });
  }

  const updates = {
    name: queenName,
  };

  const { data, error: dbError } = await supabase
    .from("queen")
    .update(updates)
    .eq("id", queenId)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data,
  });
}
