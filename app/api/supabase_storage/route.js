import { NextResponse } from 'next/server'
import { getAuthenticatedUser, getAuthenticatedAdmin } from '@/lib/supabase/auth'

export async function GET(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")
    
    const { data, error: dbError } = await supabase.storage
        .from('queen-images')
        .getPublicUrl(`${path}`)

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }
    return NextResponse.json(data.publicUrl)
}

export async function POST(request) {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const formData = await request.formData()
    const franchise = formData.get('franchise')
    const name = formData.get('name').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const file = formData.get('file')

    const { data, error: dbError } = await supabase.storage
        .from('queen-images')
        .upload(
            `${franchise}/${name}CastMug.jpg`,
            file,
            {
                upsert: true
            }
        )

    if (dbError) {
        console.error('Storage error:', dbError)

        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data.path)
}

export async function DELETE(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")

    const { data, error: dbError } = await supabase.storage
        .from('queen-images')
        .remove(`${path}`);

    if (dbError) {
        return Response.json(
        { error: dbError.message },
        { status: 500 }
        );
    }

    return Response.json({ success: true });
}