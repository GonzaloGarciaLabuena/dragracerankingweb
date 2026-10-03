import { describe, it, expect, vi, beforeEach } from "vitest";
import { profileService } from "../../lib/services/profileService";
import { profileApiClient } from "../../lib/client/profile/profileApiClient";

// Mock profileApiClient
vi.mock("../../lib/client/profile/profileApiClient", () => ({
  profileApiClient: {
    get: vi.fn(),
    getAll: vi.fn(),
    getAllOther: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateSelf: vi.fn(),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("profileService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("getProfileData", () => {
    it("call", async () => {
      profileApiClient.get.mockResolvedValue();
      const result = await profileService.getProfileData();
      expect(profileApiClient.get).toHaveBeenCalledWith();
    });
  });

  describe("getAllProfiles", () => {
    it("call", async () => {
      profileApiClient.getAll.mockResolvedValue();
      const result = await profileService.getAllProfiles();
      expect(profileApiClient.getAll).toHaveBeenCalledWith();
    });
  });

  describe("getAllOtherProfiles", () => {
    it("call", async () => {
      profileApiClient.getAllOther.mockResolvedValue();
      const result = await profileService.getAllOtherProfiles();
      expect(profileApiClient.getAllOther).toHaveBeenCalledWith();
    });
  });

  describe("updateProfile", () => {
    it("call - update to admin", async () => {
      const profile = {
        id: "profile1",
        username: "username1",
        full_name: "fullName1",
        created_at: "2026-09-16T09:13:46.036416+00:00",
        roles: "user",
      };
      const editData = {
        role: "admin",
        username: "usernameUpdate",
        full_name: "fullNameUpdate",
      };

      const data = {
        id: "profile1",
        username: "usernameUpdate",
        full_name: "fullNameUpdate",
        created_at: "2026-09-16T09:13:46.036416+00:00",
        role: "admin",
      };
      profileApiClient.update.mockResolvedValue({ success: true, data });
      const result = await profileService.updateProfile(profile, editData);
      expect(profileApiClient.update).toHaveBeenCalledWith({
        userId: profile.id,
        editData,
      });

      expect(result.data.id).toEqual(profile.id);
      expect(result.success).toEqual(true);
      expect(result.data.role).toEqual(editData.role);
      expect(result.data.username).toEqual(editData.username);
      expect(result.data.full_name).toEqual(editData.full_name);
    });

    it("call - update to user", async () => {
      const profile = {
        id: "profile1",
        username: "username1",
        full_name: "fullName1",
        created_at: "2026-09-16T09:13:46.036416+00:00",
        roles: "admin",
      };
      const editData = {
        role: "user",
        username: "usernameUpdate",
        full_name: "fullNameUpdate",
      };

      const data = {
        id: "profile1",
        username: "usernameUpdate",
        full_name: "fullNameUpdate",
        created_at: "2026-09-16T09:13:46.036416+00:00",
        role: "user",
      };
      profileApiClient.update.mockResolvedValue({ success: true, data });
      const result = await profileService.updateProfile(profile, editData);
      expect(profileApiClient.update).toHaveBeenCalledWith({
        userId: profile.id,
        editData,
      });

      expect(result.data.id).toEqual(profile.id);
      expect(result.success).toEqual(true);
      expect(result.data.role).toEqual("user");
      expect(result.data.username).toEqual("usernameUpdate");
      expect(result.data.full_name).toEqual("fullNameUpdate");
    });

    it("devuelve error cuando role es distinto a user o admin", async () => {
      const error = await profileService
        .updateProfile({ id: "profile1" }, { role: "queen" })
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual(["Role must be Admin or Usuario"]);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await profileService
        .updateProfile({}, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Profile ID is required to update profile",
        "Edit data is required to update profile",
      ]);
    });
  });

  describe("deleteProfile", () => {
    it("call", async () => {
      const profile = {
        id: "profile1",
        username: "username1",
        full_name: "fullName1",
        created_at: "2026-09-16T09:13:46.036416+00:00",
        roles: "user",
      };

      profileApiClient.delete.mockResolvedValue({ success: true });
      const result = await profileService.deleteProfile(profile);
      expect(profileApiClient.delete).toHaveBeenCalledWith({
        userId: profile.id,
      });

      expect(result.success).toEqual(true);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await profileService
        .deleteProfile({})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual(["Profile ID is required to delete profile"]);
    });
  });

  describe("updateYourProfile", () => {
    it("call", async () => {
      const editData = {
        username: "usernameUpdate",
        avatar_url: "avatarUpdate",
      };
      const data = {
        id: "profile1",
        username: "usernameUpdate",
        full_name: "fullName1",
        created_at: "2026-09-16T09:13:46.036416+00:00",
        role: "user",
        avatar_url: "avatarUpdate"
      };
      profileApiClient.updateSelf.mockResolvedValue({ success: true, data });
      const result = await profileService.updateYourProfile(editData);
      expect(profileApiClient.updateSelf).toHaveBeenCalledWith({
        editData
      });

      expect(result.data.id).toEqual(data.id);
      expect(result.success).toEqual(true);
      expect(result.data.role).toEqual(data.role);
      expect(result.data.username).toEqual(editData.username);
      expect(result.data.avatar_url).toEqual(editData.avatar_url);
    });

    it("devuelve error con entrada no permitida", async () => {
      const error = await profileService
        .updateYourProfile({role: "admin"})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Invalid fields in edit data"
      ]);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await profileService
        .updateYourProfile(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Edit data is required to update profile"
      ]);
    });
  });
});
