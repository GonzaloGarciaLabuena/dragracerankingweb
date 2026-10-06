export const supabaseStorageAPIClient = {
    getImg: async (path) => {
        const res = await fetch(`api/supabase_storage?path=${encodeURIComponent(path)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error fetching queen img')
        return res.json()
    },

    getAllImg: async (page = 1, pageSize = 20) => {
        const res = await fetch(`api/supabase_storage/images?page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error fetching queen img')
        return res.json()
    },
}