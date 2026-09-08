import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { db } from "./admin/firebase-config.js";

const homeProjectsGrid = document.getElementById("home-projects-grid");
const projectsPageGrid = document.getElementById("public-projects-grid");
const projectsGrid = homeProjectsGrid || projectsPageGrid;
const isHomePage = Boolean(homeProjectsGrid);

const LABELS = {
  en: {
    loading: "Loading projects…",
    homeEmpty: "No featured projects are available right now.",
    pageEmpty: "No published projects are available yet.",
    error: "Projects could not be loaded right now. Please try again later.",
    featured: "Featured Project",
    standard: "Project",
    live: "Live View",
    github: "GitHub",
    details: "View Details",
    noLink: "Unavailable"
  },
  ur: {
    loading: "پروجیکٹس لوڈ ہو رہے ہیں…",
    homeEmpty: "اس وقت کوئی نمایاں پروجیکٹ دستیاب نہیں۔",
    pageEmpty: "ابھی کوئی شائع شدہ پروجیکٹ دستیاب نہیں۔",
    error: "پروجیکٹس ابھی لوڈ نہیں ہو سکے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔",
    featured: "نمایاں پروجیکٹ",
    standard: "پروجیکٹ",
    live: "لائیو دیکھیں",
    github: "گٹ ہب",
    details: "تفصیلات دیکھیں",
    noLink: "دستیاب نہیں"
  }
};

const ICONS = {
  github: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  external: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  details: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>'
};

let projects = [];
let projectsLoaded = false;
let projectsLoadFailed = false;

function getLanguage() {
  return localStorage.getItem("lang") === "ur" ? "ur" : "en";
}

function getLabels() {
  return LABELS[getLanguage()];
}

function setGridState(message, state = "loading") {
  if (!projectsGrid) return;
  projectsGrid.replaceChildren();
  const stateElement = document.createElement("div");
  stateElement.className = "public-projects-state card fade-up col-span-full";
  stateElement.dataset.state = state;
  stateElement.setAttribute("role", "status");
  stateElement.textContent = message;
  projectsGrid.append(stateElement);
  refreshAnimations();
}

function refreshAnimations() {
  if (typeof window.refreshPortfolioAnimations === "function") {
    window.refreshPortfolioAnimations();
  }
}

function timestampToNumber(timestamp) {
  if (!timestamp) return 0;
  if (typeof timestamp.toMillis === "function") return timestamp.toMillis();
  if (typeof timestamp.seconds === "number") {
    return timestamp.seconds * 1000 + Math.floor((timestamp.nanoseconds || 0) / 1000000);
  }
  const parsed = Date.parse(timestamp);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function isSafeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeProject(projectDocument) {
  const data = projectDocument.data();
  return {
    id: projectDocument.id,
    title: typeof data.title === "string" ? data.title.trim() : "",
    image: typeof data.image === "string" ? data.image.trim() : "",
    shortDescription: typeof data.shortDescription === "string" ? data.shortDescription.trim() : "",
    technologies: Array.isArray(data.technologies)
      ? data.technologies.filter((technology) => typeof technology === "string" && technology.trim())
      : [],
    github: typeof data.github === "string" ? data.github.trim() : "",
    live: typeof data.live === "string" ? data.live.trim() : "",
    featured: data.featured === true,
    published: data.published === true,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function createIcon(markup) {
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = markup;
  return icon.firstElementChild;
}

function createAction(label, url, className, iconMarkup) {
  const hasUrl = isSafeUrl(url);
  const action = document.createElement(hasUrl ? "a" : "button");
  action.className = `${className} text-sm !py-2 !px-3 gap-1.5`;

  if (hasUrl) {
    action.href = url;
    action.target = "_blank";
    action.rel = "noopener noreferrer";
  } else {
    action.type = "button";
    action.disabled = true;
    action.classList.add("cursor-not-allowed", "opacity-50");
    action.title = getLabels().noLink;
  }

  if (iconMarkup) action.append(createIcon(iconMarkup));
  const text = document.createElement("span");
  text.textContent = hasUrl ? label : `${label} — ${getLabels().noLink}`;
  action.append(text);
  return action;
}

function createTechnologyBadges(technologies, spacingClass = "mb-5") {
  const wrapper = document.createElement("div");
  wrapper.className = `flex flex-wrap gap-2 ${spacingClass}`;
  technologies.forEach((technology) => {
    const badge = document.createElement("span");
    badge.className = "tech-badge";
    badge.textContent = technology;
    wrapper.append(badge);
  });
  return wrapper;
}

function createProjectCover(project) {
  const cover = document.createElement("div");
  cover.className = "project-cover h-28 flex items-end p-4";
  cover.style.background = "linear-gradient(135deg,color-mix(in srgb,var(--primary) 20%,transparent),color-mix(in srgb,var(--primary) 5%,transparent))";

  if (isSafeUrl(project.image)) {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = `${project.title} preview`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      cover.style.background = "linear-gradient(135deg,color-mix(in srgb,var(--primary) 20%,transparent),color-mix(in srgb,var(--primary) 5%,transparent))";
    });
    cover.append(image);
  }

  const badge = document.createElement("span");
  badge.className = "project-cover__badge inline-block px-3 py-1 rounded-full text-xs font-semibold";
  badge.textContent = project.featured ? getLabels().featured : getLabels().standard;
  if (project.featured) {
    badge.classList.add("text-primary");
    badge.style.background = "var(--card)";
  } else {
    badge.style.cssText = "background:var(--card);border:1px solid var(--border);color:var(--muted)";
  }
  cover.append(badge);
  return cover;
}

function createHomeProjectCard(project) {
  const card = document.createElement("div");
  card.className = "card card-featured fade-up flex flex-col overflow-hidden";

  const bar = document.createElement("div");
  bar.className = "h-1.5 w-full";
  bar.style.background = "linear-gradient(to right, var(--primary), #16A34A)";

  const body = document.createElement("div");
  body.className = "p-6 flex flex-col flex-1";

  const label = document.createElement("span");
  label.className = "inline-block px-3 py-1 rounded-full text-xs font-semibold text-primary mb-4";
  label.style.background = "color-mix(in srgb,var(--primary) 12%,transparent)";
  label.textContent = getLabels().featured;

  const title = document.createElement("h3");
  title.className = "text-xl font-bold font-poppins text-foreground mb-3";
  title.textContent = project.title;

  const description = document.createElement("p");
  description.className = "text-sm leading-relaxed flex-1 mb-5";
  description.style.color = "var(--muted)";
  description.textContent = project.shortDescription;

  const actions = document.createElement("div");
  actions.className = "public-project-actions mt-auto";
  actions.append(
    createAction(getLabels().github, project.github, "btn-outline flex-1", ICONS.github),
    createAction(getLabels().live, project.live, "btn-primary flex-1", ICONS.external)
  );

  body.append(label, title, description, createTechnologyBadges(project.technologies, "mb-6"), actions);
  card.append(bar, body);
  return card;
}

function createProjectPageCard(project) {
  const card = document.createElement("div");
  card.className = `card ${project.featured ? "card-featured " : ""}fade-up flex flex-col overflow-hidden`;

  const body = document.createElement("div");
  body.className = "p-6 flex flex-col flex-1";

  const description = document.createElement("p");
  description.className = "text-sm leading-relaxed flex-1 mb-5";
  description.style.color = "var(--muted)";
  description.textContent = project.shortDescription;

  const title = document.createElement("h3");
  title.className = "text-xl font-bold font-poppins text-foreground mb-3";
  title.textContent = project.title;

  const actions = document.createElement("div");
  actions.className = "public-project-actions";
  actions.append(
    createAction(getLabels().live, project.live, "btn-primary flex-1", ICONS.external),
    createAction(getLabels().github, project.github, "btn-outline flex-1", ICONS.github)
  );

  const details = document.createElement("a");
  details.className = "btn-outline flex-1 text-sm !py-2 !px-3 gap-1.5 cursor-not-allowed opacity-50";
  details.href = `project-details.html?id=${encodeURIComponent(project.id)}`;
  details.classList.remove("cursor-not-allowed", "opacity-50");
  details.append(createIcon(ICONS.details));
  const detailsText = document.createElement("span");
  detailsText.textContent = getLabels().details;
  details.append(detailsText);
  actions.append(details);

  body.append(title, description, createTechnologyBadges(project.technologies), actions);
  card.append(createProjectCover(project), body);
  return card;
}

function renderProjects() {
  if (!projectsGrid) return;
  const visibleProjects = isHomePage
    ? projects.filter((project) => project.featured === true && project.published === true)
    : projects.filter((project) => project.published === true);

  if (!visibleProjects.length) {
    setGridState(isHomePage ? getLabels().homeEmpty : getLabels().pageEmpty, "empty");
    return;
  }

  projectsGrid.replaceChildren();
  visibleProjects.forEach((project) => {
    projectsGrid.append(isHomePage ? createHomeProjectCard(project) : createProjectPageCard(project));
  });
  refreshAnimations();
}

async function loadProjects() {
  if (!projectsGrid) return;
  projectsLoaded = false;
  projectsLoadFailed = false;
  setGridState(getLabels().loading);

  try {
    const publishedProjectsQuery = query(
      collection(db, "projects"),
      where("published", "==", true)
    );
    const snapshot = await getDocs(publishedProjectsQuery);
    projects = snapshot.docs
      .map(normalizeProject)
      .filter((project) => project.published)
      .sort((first, second) => timestampToNumber(second.createdAt) - timestampToNumber(first.createdAt));
    projectsLoaded = true;
    renderProjects();
  } catch (error) {
    console.error("Public projects could not be loaded.", error);
    projectsLoadFailed = true;
    setGridState(getLabels().error, "error");
  }
}

document.addEventListener("portfolio:language-changed", () => {
  if (projectsLoadFailed) setGridState(getLabels().error, "error");
  else if (projectsLoaded) renderProjects();
  else if (projectsGrid) setGridState(getLabels().loading);
});

if (projectsGrid) loadProjects();