import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

const form = document.getElementById("project-form");
const formTitle = document.getElementById("project-form-title");
const addProjectButton = document.getElementById("add-project-button");
const quickAddProjectButton = document.getElementById("quick-add-project");
const cancelProjectButton = document.getElementById("cancel-project-button");
const cancelProjectButtonSecondary = document.getElementById("cancel-project-button-secondary");
const saveProjectButton = document.getElementById("save-project-button");
const projectsList = document.getElementById("projects-list");
const projectsCount = document.getElementById("projects-count");
const projectsFeedback = document.getElementById("projects-feedback");
const projectSearch = document.getElementById("project-search");
const imageUploadButton = document.getElementById("project-image-upload-button");
const imageRemoveButton = document.getElementById("project-image-remove-button");
const imageUploadStatus = document.getElementById("project-image-upload-status");
const imagePreview = document.getElementById("project-image-preview");
const imagePreviewImage = document.getElementById("project-image-preview-image");
const imagePreviewName = document.getElementById("project-image-preview-name");

const fields = {
  title: document.getElementById("project-title"),
  image: document.getElementById("project-image"),
  shortDescription: document.getElementById("project-short-description"),
  fullDescription: document.getElementById("project-full-description"),
  technologies: document.getElementById("project-technologies"),
  github: document.getElementById("project-github"),
  live: document.getElementById("project-live"),
  featured: document.getElementById("project-featured"),
  published: document.getElementById("project-published")
};

let projects = [];
let editingProjectId = null;
let saving = false;
let imageUploading = false;
let fileInput = null;

const CLOUDINARY_CONFIG = {
  cloudName: "ltdz4vmm",
  uploadPreset: "Portfolio Project",
  allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
  maxFileSize: 5 * 1024 * 1024
};

function getFileInput() {
  if (fileInput) return fileInput;
  fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = CLOUDINARY_CONFIG.allowedFormats.map((ext) => `.${ext}`).join(",");
  fileInput.addEventListener("change", handleFileSelected);
  return fileInput;
}

function handleFileSelected() {
  const file = fileInput?.files?.[0];
  if (!file) {
    imageUploading = false;
    setImageUploadState("idle", "Upload canceled. Choose an image to try again.");
    return;
  }
  fileInput.value = "";

  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  if (!CLOUDINARY_CONFIG.allowedFormats.includes(extension)) {
    setImageUploadState("error", "Only JPG, JPEG, PNG, WEBP, or GIF images are allowed.");
    return;
  }
  if (file.size > CLOUDINARY_CONFIG.maxFileSize) {
    setImageUploadState("error", "Image must be 5 MB or smaller.");
    return;
  }

  uploadImageToCloudinary(file);
}

async function uploadImageToCloudinary(file) {
  imageUploading = true;
  setImageUploadState("uploading", "Uploading image…");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error?.message || "Upload failed");
    }

    const secureUrl = result.secure_url;
    if (!secureUrl || !isValidUrl(secureUrl) || !secureUrl.startsWith("https://")) {
      throw new Error("Upload completed without a usable image URL.");
    }

    fields.image.value = secureUrl;
    showImagePreview(secureUrl, "New uploaded image");
    setImageUploadState("success", "Image uploaded successfully.");
  } catch (error) {
    console.error("Cloudinary image upload failed.", error);
    setImageUploadState("error", "Image upload failed. Please try again.");
  } finally {
    imageUploading = false;
  }
}

function setFeedback(message, type = "success") {
  if (!projectsFeedback) return;
  projectsFeedback.textContent = message;
  projectsFeedback.dataset.type = type;
  projectsFeedback.hidden = false;
}

function clearFeedback() {
  if (!projectsFeedback) return;
  projectsFeedback.textContent = "";
  projectsFeedback.hidden = true;
  delete projectsFeedback.dataset.type;
}

function setSaving(isSaving) {
  saving = isSaving;
  if (!saveProjectButton) return;
  saveProjectButton.disabled = isSaving;
  if (imageUploadButton) imageUploadButton.disabled = isSaving || imageUploading;
  saveProjectButton.textContent = isSaving
    ? (editingProjectId ? "Updating…" : "Saving…")
    : (editingProjectId ? "Update Project" : "Save Project");
}

function setImageUploadState(state, message) {
  if (imageUploadStatus) {
    imageUploadStatus.textContent = message;
    imageUploadStatus.dataset.state = state;
  }
  if (imageUploadButton) imageUploadButton.disabled = saving || state === "uploading";
}

function clearImagePreview() {
  if (imagePreviewImage) {
    imagePreviewImage.removeAttribute("src");
  }
  if (imagePreviewName) imagePreviewName.textContent = "Uploaded image";
  if (imagePreview) imagePreview.hidden = true;
}

function showImagePreview(url, label = "Uploaded image") {
  if (!imagePreview || !imagePreviewImage) return;
  imagePreviewImage.src = url;
  if (imagePreviewName) imagePreviewName.textContent = label;
  imagePreview.hidden = false;
  imagePreviewImage.onerror = () => {
    clearImagePreview();
    setImageUploadState("error", "Image preview could not be loaded.");
  };
}

function resetImageUploadState() {
  imageUploading = false;
  clearImagePreview();
  setImageUploadState("idle", "JPG, PNG, WEBP, or GIF · Max 5 MB");
}

function formatTimestamp(timestamp) {
  if (!timestamp) return "Recently";
  const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseTechnologies(value) {
  return [...new Set(
    value
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean)
  )];
}

function getFormValues() {
  return {
    title: fields.title.value.trim(),
    image: fields.image.value.trim(),
    shortDescription: fields.shortDescription.value.trim(),
    fullDescription: fields.fullDescription.value.trim(),
    technologies: parseTechnologies(fields.technologies.value),
    github: fields.github.value.trim(),
    live: fields.live.value.trim(),
    featured: fields.featured.checked,
    published: fields.published.checked
  };
}

function validateProject(project) {
  if (!project.title || !project.shortDescription || !project.fullDescription) {
    return "Title, short description, and full description are required.";
  }

  if (!isValidUrl(project.image)) return "Please enter a valid image URL.";
  if (!isValidUrl(project.github)) return "Please enter a valid GitHub URL.";
  if (!isValidUrl(project.live)) return "Please enter a valid live URL.";
  return "";
}

function resetForm() {
  form?.reset();
  editingProjectId = null;
  resetImageUploadState();
  if (formTitle) formTitle.textContent = "Add project";
  if (saveProjectButton) saveProjectButton.textContent = "Save Project";
}

function closeForm() {
  resetForm();
  if (form) form.hidden = true;
}

function openForm(project = null) {
  clearFeedback();
  editingProjectId = project?.id || null;
  if (formTitle) formTitle.textContent = project ? "Edit project" : "Add project";
  if (saveProjectButton) saveProjectButton.textContent = project ? "Update Project" : "Save Project";

  if (project) {
    fields.title.value = project.title || "";
    fields.image.value = project.image || "";
    if (project.image) showImagePreview(project.image, "Existing project image");
    else clearImagePreview();
    setImageUploadState("idle", "Upload a new image to replace the current one.");
    fields.shortDescription.value = project.shortDescription || "";
    fields.fullDescription.value = project.fullDescription || "";
    fields.technologies.value = (project.technologies || []).join(", ");
    fields.github.value = project.github || "";
    fields.live.value = project.live || "";
    fields.featured.checked = project.featured === true;
    fields.published.checked = project.published === true;
  } else {
    resetForm();
  }

  if (form) {
    form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function createStatusPill(label, modifier) {
  const pill = document.createElement("span");
  pill.className = `project-status-pill ${modifier}`;
  pill.textContent = label;
  return pill;
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const media = document.createElement("div");
  media.className = "project-card__media";

  if (project.image) {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = `${project.title} preview`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      media.classList.add("project-card__media--placeholder");
      media.textContent = "Image unavailable";
    });
    media.append(image);
  } else {
    media.classList.add("project-card__media--placeholder");
    media.textContent = "No image";
  }

  const body = document.createElement("div");
  body.className = "project-card__body";

  const headingRow = document.createElement("div");
  headingRow.className = "project-card__heading";
  const title = document.createElement("h3");
  title.textContent = project.title;
  headingRow.append(title);

  const statusRow = document.createElement("div");
  statusRow.className = "project-status-row";
  statusRow.append(
    createStatusPill(
      project.featured ? "Featured" : "Standard",
      project.featured ? "project-status-pill--featured" : "project-status-pill--muted"
    ),
    createStatusPill(
      project.published ? "Published" : "Draft",
      project.published ? "project-status-pill--published" : "project-status-pill--muted"
    )
  );

  const description = document.createElement("p");
  description.className = "project-card__description";
  description.textContent = project.shortDescription;

  const technologies = document.createElement("div");
  technologies.className = "project-card__technologies";
  if (project.technologies.length) {
    project.technologies.forEach((technology) => {
      const badge = document.createElement("span");
      badge.className = "tech-chip";
      badge.textContent = technology;
      technologies.append(badge);
    });
  } else {
    const emptyTechnology = document.createElement("span");
    emptyTechnology.className = "project-card__muted";
    emptyTechnology.textContent = "No technologies listed";
    technologies.append(emptyTechnology);
  }

  const meta = document.createElement("p");
  meta.className = "project-card__meta";
  meta.textContent = `Updated ${formatTimestamp(project.updatedAt || project.createdAt)}`;

  const links = document.createElement("div");
  links.className = "project-card__links";
  [
    ["GitHub", project.github],
    ["Live site", project.live]
  ].forEach(([label, url]) => {
    if (!url || !isValidUrl(url)) return;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    links.append(link);
  });

  const actions = document.createElement("div");
  actions.className = "project-card__actions";
  const editButton = document.createElement("button");
  editButton.className = "secondary-action";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => openForm(project));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-action";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteProject(project));
  actions.append(editButton, deleteButton);

  body.append(headingRow, statusRow, description, technologies, meta);
  if (links.childElementCount) body.append(links);
  body.append(actions);
  card.append(media, body);
  return card;
}

function renderProjects() {
  if (!projectsList || !projectsCount) return;
  const searchTerm = projectSearch?.value.trim().toLowerCase() || "";
  const filteredProjects = projects.filter((project) => {
    if (!searchTerm) return true;
    return [
      project.title,
      project.shortDescription,
      project.fullDescription,
      ...(project.technologies || [])
    ].join(" ").toLowerCase().includes(searchTerm);
  });

  projectsCount.textContent = searchTerm
    ? `${filteredProjects.length} of ${projects.length} project${projects.length === 1 ? "" : "s"}`
    : `${projects.length} project${projects.length === 1 ? "" : "s"}`;

  projectsList.replaceChildren();
  if (!filteredProjects.length) {
    const empty = document.createElement("div");
    empty.className = "projects-empty";
    const heading = document.createElement("h3");
    heading.textContent = projects.length ? "No matching projects" : "No projects yet";
    const message = document.createElement("p");
    message.textContent = projects.length
      ? "Try a different search term."
      : "Add your first project to start building the CMS collection.";
    empty.append(heading, message);
    projectsList.append(empty);
    return;
  }

  filteredProjects.forEach((project) => projectsList.append(createProjectCard(project)));
}

async function loadProjects() {
  if (!projectsList) return;
  projectsList.replaceChildren();
  const loading = document.createElement("div");
  loading.className = "projects-loading";
  loading.textContent = "Loading projects…";
  projectsList.append(loading);

  try {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(projectsQuery);
    projects = snapshot.docs.map((projectDocument) => ({
      id: projectDocument.id,
      ...projectDocument.data(),
      technologies: Array.isArray(projectDocument.data().technologies)
        ? projectDocument.data().technologies
        : []
    }));
    renderProjects();
  } catch (error) {
    console.error("Project list could not be loaded.", error);
    projects = [];
    projectsCount.textContent = "Unable to load";
    projectsList.replaceChildren();
    const errorState = document.createElement("div");
    errorState.className = "projects-empty projects-empty--error";
    const heading = document.createElement("h3");
    heading.textContent = "Projects could not be loaded";
    const message = document.createElement("p");
    message.textContent = "Please refresh the page and try again.";
    errorState.append(heading, message);
    projectsList.append(errorState);
    setFeedback("Unable to load projects. Please refresh and try again.", "error");
  }
}

async function saveProject(event) {
  event.preventDefault();
  if (saving) return;

  const project = getFormValues();
  const validationError = validateProject(project);
  if (validationError) {
    setFeedback(validationError, "error");
    return;
  }

  setSaving(true);
  clearFeedback();

  try {
    if (editingProjectId) {
      await updateDoc(doc(db, "projects", editingProjectId), {
        ...project,
        updatedAt: serverTimestamp()
      });
      setFeedback("Project updated successfully.");
    } else {
      await addDoc(collection(db, "projects"), {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setFeedback("Project added successfully.");
    }
    closeForm();
    await loadProjects();
  } catch (error) {
    console.error("Project could not be saved.", error);
    setFeedback("Project could not be saved. Please try again.", "error");
  } finally {
    setSaving(false);
  }
}

async function deleteProject(project) {
  const confirmed = window.confirm(
    `Delete "${project.title}"? This action cannot be undone.`
  );
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, "projects", project.id));
    if (editingProjectId === project.id) closeForm();
    setFeedback("Project deleted successfully.");
    await loadProjects();
  } catch (error) {
    console.error("Project could not be deleted.", error);
    setFeedback("Project could not be deleted. Please try again.", "error");
  }
}

export function initProjectsCMS() {
  if (!form || !projectsList) return;

  imageUploadButton?.addEventListener("click", () => {
    if (imageUploading || saving) return;
    getFileInput().click();
  });
  imageRemoveButton?.addEventListener("click", () => {
    fields.image.value = "";
    clearImagePreview();
    setImageUploadState("idle", "Image removed. Upload a new image or save without one.");
  });
  addProjectButton?.addEventListener("click", () => openForm());
  quickAddProjectButton?.addEventListener("click", () => openForm());
  cancelProjectButton?.addEventListener("click", closeForm);
  cancelProjectButtonSecondary?.addEventListener("click", closeForm);
  projectSearch?.addEventListener("input", renderProjects);
  form.addEventListener("submit", saveProject);
  loadProjects();
}