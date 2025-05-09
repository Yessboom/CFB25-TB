import { type RouteSectionProps } from "@solidjs/router";
import { loginOrRegister } from "../lib/index";

export default function Login(props: RouteSectionProps) {
  // Get the login type from the URL query parameter
  const loginTypeParam = () => 
    typeof window !== "undefined" 
      ? new URL(window.location.href).searchParams.get("loginType") || "login"
      : "login";
  
  // Get any error from URL if present (passed as query param after form submission)
  const errorMessage = () =>
    typeof window !== "undefined"
      ? new URL(window.location.href).searchParams.get("error")
      : null;

  const isLogin = loginTypeParam() === "login";

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 class="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        
        <form action="/api/auth" method="post" class="space-y-6">
          <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
          
          <div class="bg-gray-50 rounded-md p-3 flex justify-center space-x-6">
            <a 
              href="/login?loginType=login" 
              class={`py-2 px-4 rounded-md transition-colors ${isLogin ? "bg-blue-600 text-white" : "text-gray-500"}`}
            >
              Login
            </a>
            <a 
              href="/login?loginType=register" 
              class={`py-2 px-4 rounded-md transition-colors ${!isLogin ? "bg-blue-600 text-white" : "text-gray-500"}`}
            >
              Register
            </a>
          </div>
          
          {/* Hidden field to store the login type */}
          <input type="hidden" name="loginType" value={loginTypeParam()} />
          
          <div class="space-y-4">
            <div>
              <label for="username-input" class="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input 
                id="username-input"
                name="username" 
                placeholder="Enter your username" 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>
            
            <div>
              <label for="password-input" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input 
                id="password-input"
                name="password" 
                type="password" 
                placeholder="Enter your password" 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
          
          {errorMessage() && (
            <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert" id="error-message">
              {errorMessage()}
            </div>
          )}
          
          <div class="mt-6 text-center text-sm text-gray-500">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <a 
                  href="/login?loginType=register"
                  class="text-blue-600 hover:underline"
                >
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <a 
                  href="/login?loginType=login"
                  class="text-blue-600 hover:underline"
                >
                  Sign in
                </a>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}