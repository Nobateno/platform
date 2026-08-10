import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ForgotPasswordPage,
  LoginPage,
  authNamespace,
  authResources,
} from "@/domains/auth";
import { useStore } from "@/domains/auth/store";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

function response(payload: object = {}, ok = true): Response {
  return { ok, json: async () => payload } as Response;
}

async function renderAuthPage(page: React.ReactElement, path: string) {
  return renderWithDomainI18n(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={page} />
        <Route path="/onboarding" element={<h1>Onboarding checklist</h1>} />
      </Routes>
    </MemoryRouter>,
    authNamespace,
    authResources,
  );
}

async function enterOtp(user: ReturnType<typeof userEvent.setup>, code: string) {
  await screen.findByLabelText("Code digit 1");
  for (const [index, digit] of [...code].entries()) {
    await user.type(screen.getByLabelText(`Code digit ${index + 1}`), digit);
  }
}

describe("phone-first provider authentication", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    useStore.setState({
      currentUser: undefined,
      status: "anonymous",
      pending: false,
      error: undefined,
    });
  });

  it("asks an existing provider for a password and exposes OTP recovery", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => response({ exists: true })),
    );
    await renderAuthPage(<LoginPage />, "/login");

    expect(screen.getByText("Local test credentials")).toBeVisible();
    expect(
      screen.getByText(
        "Owner: 09120000001 — password: Demo12345! — verification code: 123456",
      ),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Continue as owner" }),
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", { name: "Mobile number" }),
      "09120000001",
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const passwordHeading = await screen.findByRole("heading", {
      name: "Enter your password",
    });
    expect(passwordHeading).toBeVisible();
    expect(passwordHeading).toHaveFocus();
    expect(screen.getByLabelText(/^Password/)).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
    expect(
      screen.getByRole("link", { name: "Forgot your password?" }),
    ).toHaveAttribute("href", "/forgot-password");
  });

  it("keeps format validation below the field without a technical session notice", async () => {
    const user = userEvent.setup();
    await renderAuthPage(<LoginPage />, "/login");

    const phoneInput = screen.getByRole("textbox", { name: "Mobile number" });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter your mobile number.",
    );
    expect(phoneInput).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.queryByText(/secure server-managed cookie/i),
    ).not.toBeInTheDocument();
  });

  it("verifies a new phone and collects a password during account onboarding", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const path = String(input);
        if (path.endsWith("phone-lookup")) return response({ exists: false });
        if (path.endsWith("otp/request")) return response();
        if (path.endsWith("otp/verify")) {
          return response({ verificationToken: "verified-registration" });
        }
        if (path.endsWith("provider/accounts")) {
          return response({
            id: "owner-new",
            fullName: "New Owner",
            roleId: "owner",
            active: true,
          });
        }
        return response({}, false);
      }),
    );
    await renderAuthPage(<LoginPage />, "/login");

    await user.type(
      screen.getByRole("textbox", { name: "Mobile number" }),
      "09121111111",
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await enterOtp(user, "123456");
    await user.click(screen.getByRole("button", { name: "Verify code" }));

    expect(
      await screen.findByRole("heading", {
        name: "Create your business account",
      }),
    ).toBeVisible();
    await user.type(screen.getByLabelText(/^Full name/), "New Owner");
    await user.type(screen.getByLabelText(/^Business name/), "New Studio");
    await user.type(screen.getByLabelText(/^New password/), "StrongPass1!");
    await user.type(
      screen.getByLabelText(/^Confirm password/),
      "StrongPass1!",
    );
    await user.click(
      screen.getByRole("button", { name: "Create account and continue" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Onboarding checklist" }),
    ).toBeVisible();
  });

  it("resets an existing provider password only after OTP verification", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const path = String(input);
        if (path.endsWith("phone-lookup")) return response({ exists: true });
        if (path.endsWith("otp/request")) return response();
        if (path.endsWith("otp/verify")) {
          return response({ verificationToken: "verified-reset" });
        }
        if (path.endsWith("password-reset")) return response();
        return response({}, false);
      }),
    );
    await renderAuthPage(<ForgotPasswordPage />, "/forgot-password");

    await user.type(
      screen.getByRole("textbox", { name: "Mobile number" }),
      "09120000001",
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await enterOtp(user, "123456");
    await user.click(screen.getByRole("button", { name: "Verify code" }));
    await user.type(
      await screen.findByLabelText(/^New password/),
      "ChangedPass1!",
    );
    await user.type(
      screen.getByLabelText(/^Confirm password/),
      "ChangedPass1!",
    );
    await user.click(
      screen.getByRole("button", { name: "Save new password" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Password updated" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to sign in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
