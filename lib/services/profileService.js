import { profileApiClient } from "../client/profile/profileApiClient";

export const profileService = {
  async getProfileData() {
    return await profileApiClient.get();
  },

  async getAllProfiles() {
    return await profileApiClient.getAll();
  },

  async getAllOtherProfiles() {
    return await profileApiClient.getAllOther();
  },

  async updateProfile(profile, editData) {
    const errors = [];

    if (profile?.id == null) {
      errors.push("Profile ID is required to update profile");
    }

    if (editData == null || typeof editData !== "object") {
        errors.push("Edit data is required to update profile");
    } else {
        if (
            editData.role !== "" &&
            editData.role !== "Admin" &&
            editData.role !== "Usuario"
        ) {
            errors.push("Role must be Admin or Usuario");
        }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await profileApiClient.update({ userId: profile.id, editData });
  },

  async deleteProfile(userId) {
    return await profileApiClient.delete({ userId });
  },

  async updateYourProfile(editData) {
    return await profileApiClient.updateSelf({ editData });
  },
};
