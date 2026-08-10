import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createStaffAccount,
  CreateStaffAccountError,
} from "@/domains/team/application/create-staff-account";

describe("createStaffAccount", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns only sanitized staff data from the account endpoint", async () => {
    const request = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          staff: {
            id: "staff-42",
            fullName: "Test Specialist",
            phone: "09123456789",
          },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", request);

    const result = await createStaffAccount({
      fullName: "Test Specialist",
      phone: "09123456789",
      password: "Staff123!",
    });

    expect(result).toEqual({
      id: "staff-42",
      fullName: "Test Specialist",
      phone: "09123456789",
    });
    expect(JSON.stringify(result)).not.toContain("Staff123!");
    expect(request).toHaveBeenCalledWith(
      "/api/provider/staff-accounts",
      expect.objectContaining({ method: "POST", credentials: "include" }),
    );
  });

  it("maps a duplicate phone response to a specific error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 409 })));

    await expect(
      createStaffAccount({
        fullName: "Test Specialist",
        phone: "09123456789",
        password: "Staff123!",
      }),
    ).rejects.toEqual(new CreateStaffAccountError("phone-in-use"));
  });
});
