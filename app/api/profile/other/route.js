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
        .select('*')
        .neq('id', user.id)
        .order('username', { ascending: true })

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }
    return NextResponse.json(data)
}