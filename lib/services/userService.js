import { usersApiClient } from '../client/user/usersApiClient'
import { profileService } from '@/lib/services/profileService'

export const userService = {
    async getUsers() {
        return await profileService.getAllProfiles()
    },

    async getAllProfiles() {
        return await profileApiClient.getAll()
    }
}