import { beforeEach, describe, expect, it, vi } from "vitest";
import { canAccessArea } from "@/domains/auth/application/permissions";
import { useStore, type PanelUser } from "@/domains/auth/store";

const owner: PanelUser = {
  id: "owner-1",
  fullName: "Test owner",
  roleId: "owner",
  active: true,
};

describe("auth store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    useStore.setState({
      currentUser: undefined,
      status: "idle",
      pending: false,
      error: undefined,
    });
  });

  it("rejects invalid server credentials without retaining form values", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, json: async () => ({}) })),
    );

    const result = await useStore
      .getState()
      .login({ phone: "09120000001", password: "incorrect" });

    expect(result).toBeUndefined();
    expect(useStore.getState()).toMatchObject({
      currentUser: undefined,
      status: "anonymous",
      error: "invalidCredentials",
    });
    expect(JSON.stringify(useStore.getState())).not.toContain("incorrect");
  });

  it("stores only the sanitized user returned by the session endpoint", async () => {
    const serverPayload = {
      ...owner,
      password: "must-not-survive",
      accessToken: "must-not-survive",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => serverPayload })),
    );

    const result = await useStore
      .getState()
      .login({ phone: "09120000001", password: "not-persisted" });

    expect(result).toEqual(owner);
    expect(useStore.getState().currentUser).toEqual(owner);
    expect(JSON.stringify(useStore.getState().currentUser)).not.toMatch(
      /password|accessToken|not-persisted|must-not-survive/i,
    );
    expect(window.localStorage.getItem("nobateno-auth")).toBeNull();
  });

  it("rejects a malformed session without leaving authentication pending", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ id: "bad" }) })),
    );

    const result = await useStore
      .getState()
      .login({ phone: "09120000001", password: "not-persisted" });

    expect(result).toBeUndefined();
    expect(useStore.getState()).toMatchObject({
      currentUser: undefined,
      status: "anonymous",
      pending: false,
      error: "invalidSession",
    });
  });

  it("keeps optional receptionist areas hidden without server grants", () => {
    expect(canAccessArea("receptionist", "reservations")).toBe(true);
    expect(canAccessArea("receptionist", "customers")).toBe(true);
    expect(canAccessArea("receptionist", "availability")).toBe(false);
  });

  it("supports credential-free development role previews in session storage", () => {
    const result = useStore.getState().loginDemo("receptionist");
    const stored = window.sessionStorage.getItem("nobateno-demo-session") ?? "";

    expect(result).toMatchObject({ roleId: "receptionist", active: true });
    expect(stored).not.toMatch(/password|seller123|owner123/i);
    expect(useStore.getState().status).toBe("authenticated");
  });

  it("restores a sanitized development session without a network request", async () => {
    useStore.getState().loginDemo("staff");
    useStore.setState({ currentUser: undefined, status: "idle", pending: false });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await useStore.getState().initialize();

    expect(useStore.getState().currentUser?.roleId).toBe("staff");
    expect(useStore.getState().status).toBe("authenticated");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears the local session before requesting server logout", async () => {
    useStore.getState().loginDemo("owner");
    const fetchMock = vi.fn(async () => ({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await useStore.getState().logout();

    expect(useStore.getState()).toMatchObject({
      currentUser: undefined,
      status: "anonymous",
    });
    expect(window.sessionStorage.getItem("nobateno-demo-session")).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/provider/session",
      expect.objectContaining({ method: "DELETE", credentials: "include" }),
    );
  });
});
