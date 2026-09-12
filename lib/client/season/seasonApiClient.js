export const seasonApiClient = {
    create: async (data) => {
        const res = await fetch('/api/season', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) throw new Error('Error creating season')
        return res.json()
    },

    getRankableSeasons: async () => {
        const res = await fetch('/api/season/rankeable', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) throw new Error('Error fetching seasons')
        return res.json()
    },

    update: async (data) => {
        const res = await fetch('/api/season', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) throw new Error('Error updating seasons')
        return res.json()
    },

    getAllSeasons: async () => {
        const res = await fetch('/api/season', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) throw new Error('Error fetching seasons')
        return res.json()
    },

    getUserRankedSeasons: async (userId) => {
        const res = await fetch(`/api/season/other?userId=${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) throw new Error('Error fetching seasons')
        return res.json()
    }
}