export const profileApiClient = {
    get: async () => {
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error getting profile data')
        return res.json()
    },

    getAll: async () => {
        const res = await fetch('/api/profile/all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error getting profile data')
        return res.json()
    },

    getAllOther: async () => {
        const res = await fetch('/api/profile/other', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error getting profile data')
        return res.json()
    },

    update: async (data) => {
        const res = await fetch('/api/profile/admin', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok){
            const err = await res.json()
            console.error(err)
            throw new Error('Error updating profile')
        }
        return res.json()
    },

    updateSelf: async (data) => {
        const res = await fetch('/api/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok){
            const err = await res.json()
            console.error(err)
            throw new Error('Error updating profile')
        }
        return res.json()
    },

    delete: async (data) => {
        const res = await fetch(`/api//profile/admin`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Error deleting profile')
        return res.json()
    }
}