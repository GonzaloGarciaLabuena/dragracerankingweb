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

export async function POST(request) {
  const { supabase, response } = await getAuthenticatedAdmin();

  if (response) {
    return response;
  }

  const body = await request.json();
  const { seasonId, newEpisode } = body;

  const { data, error: dbError } = await supabase
    .from("episode")
    .insert({
      season_id: seasonId,
      title: newEpisode.title,
      esFinal: newEpisode.esFinal,
      esFinalDraga: newEpisode.esFinalDraga,
    })
    .select(); // Devuelve el dato insertado

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request) {
  const { supabase, response } = await getAuthenticatedAdmin();

  if (response) {
    return response;
  }

  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("season");

  const { data, error: dbError } = await supabase.rpc("delete_last_episode", {
    p_season_id: seasonId,
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request) {
  const { supabase, response } = await getAuthenticatedAdmin();

  if (response) {
    return response;
  }

  const body = await request.json();
  const { episode } = body;

  if (!episode.id) {
    return Response.json({ error: "Episode id is required" }, { status: 400 });
  }

  if (!episode.title) {
    return Response.json(
      { error: "New title for the episode is required" },
      { status: 400 },
    );
  }

  if (episode.esFinal === null) {
    return Response.json(
      { error: "Is finale episode is required" },
      { status: 400 },
    );
  }

  if (episode.esFinalDraga === null) {
    return Response.json(
      {
        error:
          "Is finaleDraga episode is required for a la mas draga finale episode",
      },
      { status: 400 },
    );
  }

  const updates = {
    title: episode.title,
    esFinal: episode.esFinal,
    esFinalDraga: episode.esFinalDraga,
  };
  
  const { data, error: dbError } = await supabase
    .from("episode")
    .update(updates)
    .eq("id", episode.id)
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
