import { profileApiClient } from '../client/profile/profileApiClient'

export const profileService = {
    async getProfileData() {
        return await profileApiClient.get()
    },

    async getAllProfiles() {
        return await profileApiClient.getAll()
    },

    async getAllOtherProfiles(){
        return await profileApiClient.getAllOther()
    },

    async updateProfile(userId, editData) {
        return await profileApiClient.update({userId, editData})
    },

    async deleteProfile(userId) {
        return await profileApiClient.delete({userId})
    },

    async updateYourProfile(editData){
        return await profileApiClient.updateSelf({editData})
    }
}