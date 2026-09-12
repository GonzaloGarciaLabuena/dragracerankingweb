export const episodeApiClient = {
    create: async (data) => {
        const res = await fetch('/api/episode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) throw new Error('Error creating episode')
        return res.json()
    },

    get: async (season) => {
        const res = await fetch(`/api/episode?season=${encodeURIComponent(season)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error getting episode')
        return res.json()
    },

    deleteLast: async (season) => {
        const res = await fetch(`/api/episode?season=${encodeURIComponent(season)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error deleting episode')
        return res.json()
    },

    update: async (data) => {
        const res = await fetch('/api/episode', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!res.ok){
            throw new Error('Error updating episode')
        } 
        return res.json()
    }
}