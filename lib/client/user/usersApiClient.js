export const usersApiClient = {
    getUsers: async () => {
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) throw new Error('Error fetching seasons')
        return res.json()
    }
}