import { NextResponse } from 'next/server'
import { getAuthenticatedUser, getAuthenticatedAdmin } from '@/lib/supabase/auth'

export async function GET() {
    const { supabase, response } = await getAuthenticatedUser()

    if (response) {
        return response
    }

    const { data, error: dbError } = await supabase
        .from('season')
        .select('*')
        .order('year', { ascending: false })

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}

export async function POST(request) {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const body = await request.json()

    const { data, error: dbError } = await supabase
        .from('season')
        .insert({
            name: body.name,
            franchise: body.franchise,
            year: body.year
        })
        .select() // Devuelve el dato insertado

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data[0])
}

export async function PATCH(request) {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const body = await request.json()

    if (!body.id) {
        return Response.json(
            { error: 'Season id is required' },
            { status: 400 }
        )
    }

    const updates = {
        name: body.name,
        franchise: body.franchise,
        year: body.year
    }

    const { data, error: dbError } = await supabase
        .from('season')
        .update(updates)
        .eq('id', body.id)
        .select()
        .single()

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json({
        success: true,
        data
    })
}