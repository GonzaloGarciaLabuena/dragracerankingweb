import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'

export async function GET(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const { data, error: dbError } = await supabase.rpc(
        'get_user_ranked_seasons',
        {
            target_user_id: userId
        }
    )

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}