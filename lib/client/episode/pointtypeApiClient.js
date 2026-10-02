export const pointtypeApiClient = {
    getAll: async (mode) => {
        const res = await fetch(`/api/pointtype?mode=${mode}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) throw new Error('Error creating episode')
        return res.json()
    },
}