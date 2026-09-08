import {
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { verifyAdmin } from "./admin-auth.js";

const form = document.getElementById("admin-login-form");
const emailInput = document.getElementById("admin-email");
const passwordInput = document.getElementById("admin-password");
const loginButton = document.getElementById("login-button");
const errorMessage = document.getElementById("login-error");
const themeToggle = document.querySelector("[data-theme-toggle]");

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  localStorage.setItem("theme", nextTheme);
  if (themeToggle) {
    themeToggle.textContent = nextTheme === "dark" ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme === "dark" ? "light" : "dark"} mode`);
  }
}

function showError(message) {
  if (!errorMessage) return;
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearError() {
  if (!errorMessage) return;
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

function setLoading(isLoading) {
  if (!loginButton) return;
  loginButton.disabled = isLoading;
  loginButton.textContent = isLoading ? "Signing in…" : "Sign in";
  form?.classList.toggle("is-loading", isLoading);
}

function getLoginErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please wait and try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/user-disabled":
      return "This account is disabled. Please contact an administrator.";
    default:
      return "Unable to sign in. Please check your details and try again.";
  }
}

themeToggle?.addEventListener("click", () => {
  applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
});
applyTheme(localStorage.getItem("theme") || "dark");

const passwordToggle = document.getElementById("password-toggle");
const eyeIcon = passwordToggle?.querySelector(".icon-eye");
const eyeOffIcon = passwordToggle?.querySelector(".icon-eye-off");

passwordToggle?.addEventListener("click", () => {
  if (!passwordInput) return;
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  passwordToggle.setAttribute("aria-pressed", String(show));
  passwordToggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
  passwordToggle.setAttribute("title", show ? "Hide password" : "Show password");
  if (eyeIcon) eyeIcon.toggleAttribute("hidden", show);
  if (eyeOffIcon) eyeOffIcon.toggleAttribute("hidden", !show);
  passwordInput.focus();
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();
  setLoading(true);

  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    // onAuthStateChanged performs the required Firestore role check.
  } catch (error) {
    console.error("Admin sign-in failed.", error);
    showError(getLoginErrorMessage(error));
    setLoading(false);
  }
});

let initialAuthCheck = true;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (initialAuthCheck) {
      initialAuthCheck = false;
      setLoading(false);
    }
    return;
  }

  initialAuthCheck = false;
  clearError();
  setLoading(true);

  const result = await verifyAdmin(user);
  if (result.authorized) {
    window.location.replace("./dashboard.html");
    return;
  }

  setLoading(false);
  showError(
    result.reason === "verification-error"
      ? "We could not verify your admin access. Please try again."
      : "You are not authorized to access the admin panel."
  );
});