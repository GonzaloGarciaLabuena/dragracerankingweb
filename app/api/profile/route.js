import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'

export async function GET() {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { data, error: dbError } = await supabase
        .from('profiles')
        .select('full_name, username, role')
        .eq('id', user.id)
        .single()


    if (dbError) {
        console.error(dbError)
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }
    return NextResponse.json(data)
}

export async function PATCH(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const body = await request.json()

    if (!body.editData) {
        return Response.json(
            { error: 'Data for profile is required' },
            { status: 400 }
        )
    }
    
    const updates = {}

    if (body.editData.role !== undefined) {
        updates.role = body.editData.role
    }

    if (body.editData.username !== undefined) {
        updates.username = body.editData.username
    }

    if (body.editData.full_name !== undefined) {
        updates.full_name = body.editData.full_name
    }

    const { data, error: dbError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
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