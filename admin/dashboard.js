import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { verifyAdmin } from "./admin-auth.js";
import { initProjectsCMS } from "./projects.js";

const logoutButton = document.getElementById("logout-button");
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.getElementById("menu-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const sidebar = document.getElementById("admin-sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const notice = document.getElementById("dashboard-notice");
const dashboardView = document.getElementById("dashboard-view");
const projectsView = document.getElementById("projects-view");
const pageKicker = document.getElementById("dashboard-page-kicker");
const pageTitle = document.getElementById("dashboard-page-title");
const quickAddProject = document.getElementById("quick-add-project");
const adminEmail = document.getElementById("admin-email");
const accountEmail = document.getElementById("account-email");
const sidebarAdminEmail = document.getElementById("sidebar-admin-email");
let redirecting = false;
let projectsInitialized = false;

function redirectToLogin() {
  if (redirecting) return;
  redirecting = true;
  window.location.replace("./");
}

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  localStorage.setItem("theme", nextTheme);
  if (themeToggle) {
    themeToggle.textContent = nextTheme === "dark" ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme === "dark" ? "light" : "dark"} mode`);
  }
}

function setDrawerOpen(isOpen) {
  sidebar?.classList.toggle("is-open", isOpen);
  if (sidebarOverlay) {
    sidebarOverlay.hidden = !isOpen;
    sidebarOverlay.classList.toggle("is-visible", isOpen);
  }
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  }
  document.body.classList.toggle("drawer-open", isOpen);
}

function showPlaceholderNotice(section) {
  if (!notice) return;
  notice.textContent = `${section} management will be available in a later chunk.`;
  notice.hidden = false;
}

function selectView(view) {
  const isProjects = view === "projects";
  if (dashboardView) dashboardView.hidden = isProjects;
  if (projectsView) projectsView.hidden = !isProjects;
  if (pageKicker) pageKicker.textContent = isProjects ? "Admin / Projects" : "Admin / Overview";
  if (pageTitle) pageTitle.textContent = isProjects ? "Projects" : "Dashboard";
  if (notice) notice.hidden = true;

  document.querySelectorAll("[data-dashboard-nav]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.dashboardNav === view);
  });
  setDrawerOpen(false);
}

themeToggle?.addEventListener("click", () => {
  applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
});
applyTheme(localStorage.getItem("theme") || "dark");

menuToggle?.addEventListener("click", () => setDrawerOpen(true));
sidebarClose?.addEventListener("click", () => setDrawerOpen(false));
sidebarOverlay?.addEventListener("click", () => setDrawerOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setDrawerOpen(false);
});

document.querySelectorAll("[data-dashboard-nav]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    selectView(item.dataset.dashboardNav);
  });
});

document.querySelectorAll("[data-placeholder-nav]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    showPlaceholderNotice(item.dataset.placeholderNav);
    setDrawerOpen(false);
  });
});

quickAddProject?.addEventListener("click", () => {
  selectView("projects");
  document.getElementById("add-project-button")?.click();
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    redirectToLogin();
    return;
  }

  const result = await verifyAdmin(user);
  if (!result.authorized) {
    redirectToLogin();
    return;
  }

  const email = user.email || "Authenticated administrator";
  if (adminEmail) adminEmail.textContent = email;
  if (accountEmail) accountEmail.textContent = email;
  if (sidebarAdminEmail) sidebarAdminEmail.textContent = email;
  if (!projectsInitialized) {
    projectsInitialized = true;
    initProjectsCMS();
  }
  document.body.classList.remove("dashboard-pending");
});

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;
  logoutButton.textContent = "Logging out…";

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Admin sign-out failed.", error);
  } finally {
    redirectToLogin();
  }
});