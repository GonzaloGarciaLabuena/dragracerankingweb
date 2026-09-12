import { NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/supabase/auth'

export async function GET() {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const { data, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }
    return NextResponse.json(data)
}

export async function PATCH(request) {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const body = await request.json()
    if (!body.userId) {
        return Response.json(
            { error: 'Profile id is required' },
            { status: 400 }
        )
    }
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
        .eq('id', body.userId)
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

export async function DELETE(request) {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const body = await request.json()
    if (!body.userId) {
        return Response.json(
            { error: 'User id is required' },
            { status: 400 }
        )
    }

    const { error } = await supabase.auth.admin.deleteUser(body.userId)

    if (error) {
        console.error(error)
        return Response.json(
            { error: 'Error deleting user' },
            { status: 400 }
        )
    }

    return NextResponse.json({
        success: true
    })
}