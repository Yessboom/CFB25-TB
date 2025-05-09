import { json, redirect } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { login, register, validatePassword, validateUsername } from "~/lib/server";

export async function POST({ request }: APIEvent) {
  const formData = await request.formData();
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType") || "login");
  const redirectTo = String(formData.get("redirectTo") || "/");

  // Validate input
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  
  if (usernameError || passwordError) {
    const error = usernameError || passwordError;
    return redirect(`/login?error=${encodeURIComponent(error ?? "Unknown error")}&loginType=${loginType}`);
  }

  try {
    if (loginType === "login") {
      await login(username, password);
    } else {
      await register(username, password);
    }
    
    // Successful login/registration
    return redirect(redirectTo);
  } catch (error) {
    // Failed login/registration
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return redirect(`/login?error=${encodeURIComponent(errorMessage)}&loginType=${loginType}`);
  }
}