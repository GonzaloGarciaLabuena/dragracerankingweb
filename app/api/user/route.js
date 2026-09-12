import { NextResponse } from 'next/server'
import { getAuthenticatedUser, getAuthenticatedAdmin } from '@/lib/supabase/auth'

export async function GET() {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

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