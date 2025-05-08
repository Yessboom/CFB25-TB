import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { loginOrRegister } from "../lib/index";
import { checkAuth } from "./api/auth";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [loginType, setLoginType] = createSignal<"login" | "register">("login");

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 class="text-2xl font-bold text-center mb-6">
          {loginType() === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        
        <form action={loginOrRegister} method="post" class="space-y-6">
          <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
          
          <div class="bg-gray-50 rounded-md p-3 flex justify-center space-x-6">
            <label class="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="loginType" 
                value="login" 
                checked={loginType() === "login"} 
                onChange={() => setLoginType("login")}
                class="hidden" 
              />
              <div class={`py-2 px-4 rounded-md transition-colors ${loginType() === "login" ? "bg-blue-600 text-white" : "text-gray-500"}`}>
                Login
              </div>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="loginType" 
                value="register" 
                checked={loginType() === "register"} 
                onChange={() => setLoginType("register")}
                class="hidden" 
              />
              <div class={`py-2 px-4 rounded-md transition-colors ${loginType() === "register" ? "bg-blue-600 text-white" : "text-gray-500"}`}>
                Register
              </div>
            </label>
          </div>
          
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
              />
            </div>
            

          </div>
          
          <button 
            type="submit" 
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {loginType() === "login" ? "Sign In" : "Create Account"}
          </button>
          
          <Show when={loggingIn.result}>
            <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert" id="error-message">
              {loggingIn.result!.message}
            </div>
          </Show>
          
          <div class="mt-6 text-center text-sm text-gray-500">
            {loginType() === "login" ? (
              <p>
                Don't have an account?{" "}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginType("register");
                  }}
                  class="text-blue-600 hover:underline"
                >
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginType("login");
                  }}
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