import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { db } from "./admin/firebase-config.js";

const loadingState = document.getElementById("project-details-loading");
const errorState = document.getElementById("project-details-error");
const content = document.getElementById("project-details-content");
const errorTitle = document.getElementById("project-error-title");
const errorMessage = document.getElementById("project-error-message");
const errorBack = document.getElementById("project-error-back");
const headerBack = document.getElementById("details-header-back");
const projectTitle = document.getElementById("project-title");
const statusLabel = document.getElementById("project-status-label");
const imageCover = document.getElementById("project-detail-cover");
const fullDescription = document.getElementById("project-full-description");
const descriptionHeading = document.getElementById("project-description-heading");
const technologiesHeading = document.getElementById("project-technologies-heading");
const technologiesContainer = document.getElementById("project-technologies");
const actionsContainer = document.getElementById("project-actions");
const backButton = document.getElementById("project-back-button");
const backLabel = document.getElementById("project-back-label");

const LABELS = {
  en: {
    loading: "Loading project…",
    notFoundTitle: "Project not found",
    notFoundMessage: "This project may be unpublished, unavailable, or the link may be invalid.",
    errorTitle: "Unable to load project",
    errorMessage: "The project could not be loaded right now. Please try again later.",
    back: "← Back to Projects",
    featured: "Featured Project",
    standard: "Project",
    description: "About This Project",
    technologies: "Technologies",
    live: "Live View",
    github: "GitHub",
    noLink: "Unavailable",
    noImage: "Project image unavailable",
    noTechnologies: "No technologies listed"
  },
  ur: {
    loading: "پروجیکٹ لوڈ ہو رہا ہے…",
    notFoundTitle: "پروجیکٹ نہیں ملا",
    notFoundMessage: "یہ پروجیکٹ شائع نہیں ہوا، دستیاب نہیں ہے، یا لنک غلط ہے۔",
    errorTitle: "پروجیکٹ لوڈ نہیں ہو سکا",
    errorMessage: "پروجیکٹ ابھی لوڈ نہیں ہو سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔",
    back: "← پروجیکٹس پر واپس",
    featured: "نمایاں پروجیکٹ",
    standard: "پروجیکٹ",
    description: "اس پروجیکٹ کے بارے میں",
    technologies: "ٹیکنالوجیز",
    live: "لائیو دیکھیں",
    github: "گٹ ہب",
    noLink: "دستیاب نہیں",
    noImage: "پروجیکٹ کی تصویر دستیاب نہیں",
    noTechnologies: "کوئی ٹیکنالوجی درج نہیں"
  }
};

const ICONS = {
  github: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  external: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'
};

let currentProject = null;
let currentError = null;

function getLanguage() {
  return localStorage.getItem("lang") === "ur" ? "ur" : "en";
}

function getLabels() {
  return LABELS[getLanguage()];
}

function refreshAnimations() {
  if (typeof window.refreshPortfolioAnimations === "function") {
    window.refreshPortfolioAnimations();
  }
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

function getProjectId() {
  const projectId = new URLSearchParams(window.location.search).get("id");
  if (!projectId || projectId.includes("/") || projectId.length > 1500) return null;
  return projectId;
}

function normalizeProject(projectDocument) {
  const data = projectDocument.data();
  return {
    id: projectDocument.id,
    title: typeof data.title === "string" ? data.title.trim() : "",
    image: typeof data.image === "string" ? data.image.trim() : "",
    fullDescription: typeof data.fullDescription === "string" ? data.fullDescription.trim() : "",
    technologies: Array.isArray(data.technologies)
      ? data.technologies.filter((technology) => typeof technology === "string" && technology.trim())
      : [],
    github: typeof data.github === "string" ? data.github.trim() : "",
    live: typeof data.live === "string" ? data.live.trim() : "",
    featured: data.featured === true,
    published: data.published === true
  };
}

function setPageState(state, title = "", message = "") {
  loadingState.hidden = state !== "loading";
  errorState.hidden = state !== "error";
  content.hidden = state !== "content";

  if (state === "loading") {
    loadingState.textContent = getLabels().loading;
  }

  if (state === "error") {
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    errorBack.textContent = getLabels().back;
  }

  refreshAnimations();
}

function renderImage(project) {
  imageCover.replaceChildren();
  imageCover.classList.remove("project-detail-cover--placeholder");

  const showPlaceholder = () => {
    imageCover.replaceChildren();
    imageCover.classList.add("project-detail-cover--placeholder");
    const placeholder = document.createElement("span");
    placeholder.textContent = getLabels().noImage;
    imageCover.append(placeholder);
  };

  if (!isSafeUrl(project.image)) {
    showPlaceholder();
    return;
  }

  const image = document.createElement("img");
  image.src = project.image;
  image.alt = `${project.title} preview`;
  image.addEventListener("error", showPlaceholder, { once: true });
  imageCover.append(image);
}

function renderTechnologies(project) {
  technologiesContainer.replaceChildren();
  if (!project.technologies.length) {
    const empty = document.createElement("span");
    empty.className = "text-sm";
    empty.style.color = "var(--muted)";
    empty.textContent = getLabels().noTechnologies;
    technologiesContainer.append(empty);
    return;
  }

  project.technologies.forEach((technology) => {
    const badge = document.createElement("span");
    badge.className = "tech-badge";
    badge.textContent = technology;
    technologiesContainer.append(badge);
  });
}

function renderProject(project) {
  projectTitle.textContent = project.title;
  statusLabel.textContent = project.featured ? getLabels().featured : getLabels().standard;
  statusLabel.style.background = "color-mix(in srgb,var(--primary) 12%,transparent)";
  fullDescription.textContent = project.fullDescription;
  descriptionHeading.textContent = getLabels().description;
  technologiesHeading.textContent = getLabels().technologies;
  backLabel.textContent = getLabels().back;
  headerBack.textContent = getLabels().back;
  document.title = `${project.title} — Abdullah Dev Studio`;

  renderImage(project);
  renderTechnologies(project);
  actionsContainer.replaceChildren(
    createAction(getLabels().live, project.live, "btn-primary flex-1", ICONS.external),
    createAction(getLabels().github, project.github, "btn-outline flex-1", ICONS.github)
  );
  refreshAnimations();
}

async function loadProject() {
  currentProject = null;
  currentError = null;
  setPageState("loading");
  const projectId = getProjectId();

  if (!projectId) {
    currentError = "notFound";
    setPageState("error", getLabels().notFoundTitle, getLabels().notFoundMessage);
    return;
  }

  try {
    const projectDocument = await getDoc(doc(db, "projects", projectId));
    if (!projectDocument.exists()) {
      currentError = "notFound";
      setPageState("error", getLabels().notFoundTitle, getLabels().notFoundMessage);
      return;
    }

    const project = normalizeProject(projectDocument);
    if (!project.published || !project.title || !project.fullDescription) {
      currentError = "notFound";
      setPageState("error", getLabels().notFoundTitle, getLabels().notFoundMessage);
      return;
    }

    currentProject = project;
    renderProject(project);
    setPageState("content");
  } catch (error) {
    console.error("Project details could not be loaded.", error);
    if (error.code === "permission-denied") {
      currentError = "notFound";
      setPageState("error", getLabels().notFoundTitle, getLabels().notFoundMessage);
    } else {
      currentError = "error";
      setPageState("error", getLabels().errorTitle, getLabels().errorMessage);
    }
  }
}

document.addEventListener("portfolio:language-changed", () => {
  if (currentProject) {
    renderProject(currentProject);
    setPageState("content");
  } else if (currentError === "notFound") {
    setPageState("error", getLabels().notFoundTitle, getLabels().notFoundMessage);
  } else if (currentError === "error") {
    setPageState("error", getLabels().errorTitle, getLabels().errorMessage);
  } else {
    setPageState("loading");
  }
});

loadProject();