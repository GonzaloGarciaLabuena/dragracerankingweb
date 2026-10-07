import { describe, it, expect, vi, beforeEach } from "vitest";
import { profileApiClient } from "../../lib/client/profile/profileApiClient";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("profileApiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("get", () => {
    it("calls the API correctly and returns the data", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(undefined),
      });

      await profileApiClient.get();

      expect(fetch).toHaveBeenCalledWith("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error getting profile data",
        }),
      });

      await expect(profileApiClient.get()).rejects.toThrow(
        "Error getting profile data",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(profileApiClient.get()).rejects.toThrow(
        "Error getting profile data",
      );
    });
  });

  describe("getAll", () => {
    it("calls the API correctly and returns the data", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(undefined),
      });

      await profileApiClient.getAll();

      expect(fetch).toHaveBeenCalledWith("/api/profile/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error getting profile data",
        }),
      });

      await expect(profileApiClient.getAll()).rejects.toThrow(
        "Error getting profile data",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(profileApiClient.getAll()).rejects.toThrow(
        "Error getting profile data",
      );
    });
  });

  describe("getAllOther", () => {
    it("calls the API correctly and returns the data", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(undefined),
      });

      await profileApiClient.getAllOther();

      expect(fetch).toHaveBeenCalledWith("/api/profile/other", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error getting profile data",
        }),
      });

      await expect(profileApiClient.getAllOther()).rejects.toThrow(
        "Error getting profile data",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(profileApiClient.getAllOther()).rejects.toThrow(
        "Error getting profile data",
      );
    });
  });

  describe("update", () => {
    it("calls the API correctly and returns the data", async () => {
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

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data }),
      });

      const result = await profileApiClient.update({
        userId: profile.id,
        editData,
      });

      expect(fetch).toHaveBeenCalledWith("/api/profile/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.id,
          editData,
        }),
      });

      expect(result.data).toEqual(data);
      expect(result.success).toEqual(true);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        profileApiClient.update({
          userId: null,
          editData: {},
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "User ID is required to update episode",
          "Role is required to update episode",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(profileApiClient.update(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to create episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when editData is not an object", async () => {
      await expect(
        profileApiClient.update({
          userId: "user1",
          editData: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Edit Data object is required to update episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error updating profile",
        }),
      });

      await expect(
        profileApiClient.update({
          userId: "user1",
          editData: {
            role: "user",
            username: "usernameUpdate",
            full_name: "fullNameUpdate",
          },
        }),
      ).rejects.toThrow("Error updating profile");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        profileApiClient.update({
          userId: "user1",
          editData: {
            role: "user",
            username: "usernameUpdate",
            full_name: "fullNameUpdate",
          },
        }),
      ).rejects.toThrow("Error updating profile");
    });
  });

  describe("updateSelf", () => {
    it("calls the API correctly and returns the data", async () => {
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
        avatar_url: "avatarUpdate",
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data }),
      });

      const result = await profileApiClient.updateSelf({
        editData,
      });

      expect(fetch).toHaveBeenCalledWith("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editData,
        }),
      });

      expect(result.data).toEqual(data);
      expect(result.success).toEqual(true);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        profileApiClient.updateSelf({
          editData: { role: "admin" },
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Invalid fields in edit data"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(profileApiClient.updateSelf(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to update profile"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when editData is not an object", async () => {
      await expect(
        profileApiClient.updateSelf({
          editData: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Edit data is required to update profile"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error updating profile",
        }),
      });

      await expect(
        profileApiClient.updateSelf({
          editData: {
            username: "usernameUpdate",
            avatar_url: "avatarUpdate",
          },
        }),
      ).rejects.toThrow("Error updating profile");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        profileApiClient.updateSelf({
          editData: {
            username: "usernameUpdate",
            avatar_url: "avatarUpdate",
          },
        }),
      ).rejects.toThrow("Error updating profile");
    });
  });

  describe("delete", () => {
    it("calls the API correctly and returns the data", async () => {
      const profile = {
        id: "profile1",
        username: "username1",
        full_name: "fullName1",
        created_at: "2026-09-16T09:13:46.036416+00:00",
        roles: "user",
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      const result = await profileApiClient.delete({
        userId: profile.id,
      });

      expect(fetch).toHaveBeenCalledWith(`/api//profile/admin`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.id,
        }),
      });

      expect(result.success).toEqual(true);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        profileApiClient.delete({
          userId: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["User ID is required to delete episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(profileApiClient.delete(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to delete episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });


    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error deleting profile",
        }),
      });

      await expect(
        profileApiClient.delete({
          userId: "user1",
        }),
      ).rejects.toThrow("Error deleting profile");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        profileApiClient.delete({
          userId: "user1",
        }),
      ).rejects.toThrow("Error deleting profile");
    });
  });
});
