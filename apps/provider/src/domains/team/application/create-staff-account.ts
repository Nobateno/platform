export interface CreateStaffAccountInput {
  fullName: string;
  phone: string;
  password: string;
}

export interface CreatedStaffAccount {
  id: string;
  fullName: string;
  phone: string;
}

export type CreateStaffAccountErrorCode = "phone-in-use" | "request-failed";

export class CreateStaffAccountError extends Error {
  constructor(public readonly code: CreateStaffAccountErrorCode) {
    super(code);
    this.name = "CreateStaffAccountError";
  }
}

const isDevelopmentFallback = () => import.meta.env.DEV;

const createDevelopmentAccount = (
  input: CreateStaffAccountInput,
): CreatedStaffAccount => ({
  id: `staff-${Date.now()}`,
  fullName: input.fullName,
  phone: input.phone,
});

export async function createStaffAccount(
  input: CreateStaffAccountInput,
): Promise<CreatedStaffAccount> {
  try {
    const response = await fetch("/api/provider/staff-accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    });

    if (response.status === 409) {
      throw new CreateStaffAccountError("phone-in-use");
    }

    if (!response.ok) {
      if (isDevelopmentFallback() && response.status === 404) {
        return createDevelopmentAccount(input);
      }
      throw new CreateStaffAccountError("request-failed");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      if (isDevelopmentFallback()) return createDevelopmentAccount(input);
      throw new CreateStaffAccountError("request-failed");
    }

    const payload = (await response.json()) as {
      staff?: Partial<CreatedStaffAccount>;
    };
    if (
      !payload.staff?.id ||
      !payload.staff.fullName ||
      !payload.staff.phone
    ) {
      throw new CreateStaffAccountError("request-failed");
    }

    return {
      id: payload.staff.id,
      fullName: payload.staff.fullName,
      phone: payload.staff.phone,
    };
  } catch (error) {
    if (error instanceof CreateStaffAccountError) throw error;
    if (isDevelopmentFallback()) return createDevelopmentAccount(input);
    throw new CreateStaffAccountError("request-failed");
  }
}
