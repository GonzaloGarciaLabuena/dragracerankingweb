import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/supabase/auth";

export async function POST(request) {
  const { supabase, response } = await getAuthenticatedAdmin();

  if (response) {
    return response;
  }

  const body = await request.json();
  const { episode_id, round_number, number, queen1_id, queen2_id, queen3_id} = body;

  const { data, error: dbError } = await supabase
    .from("lipsync_battle")
    .insert({
      episode_id: episode_id,
      round_number: round_number,
      number: number,
      queen1_id: queen1_id,
      queen2_id: queen2_id,
      queen3_id: queen3_id
    })
    .select(); // Devuelve el dato insertado

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
  const { id, round_number, number, queen1_id, queen2_id, queen3_id} = body;

  const updates = {
    round_number: round_number,
    number: number,
    queen1_id: queen1_id,
    queen2_id: queen2_id,
    queen3_id: queen3_id
  };

  const { data, error: dbError } = await supabase
    .from("lipsync_battle")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}