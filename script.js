async function loadProjects() {
  const container = document.getElementById("projects");

  try {
    const response = await fetch(`projects.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = "<p>No projects yet. Add some in <code>projects.json</code>.</p>";
      return;
    }

    container.innerHTML = projects
      .map((project, idx) => {
        const galleryImages = normalizeProjectImages(project);
        const hasImage = galleryImages.length > 0;
        const imageSrc = hasImage ? galleryImages[0] : "assets/placeholder.svg";
        const imageAlt = `${project.title || "Project"} preview`;
        const extraImages = galleryImages.length > 1
          ? `<span class=\"image-count\">+${galleryImages.length - 1}</span>`
          : "";

        const imageMarkup = hasImage
          ? `
            <button class=\"card-image image-trigger\" type=\"button\" data-project-index=\"${idx}\" aria-label=\"Open image gallery for ${project.title || "project"}\">
              <img
                src=\"${imageSrc}\"
                alt=\"${imageAlt}\"
                loading=\"lazy\"
                decoding=\"async\"
                onerror=\"this.onerror=null;this.src='assets/placeholder.svg';this.parentElement.classList.add('is-placeholder');\"
              />
              ${extraImages}
            </button>
          `
          : `
            <div class=\"card-image is-placeholder\">
              <img
                src=\"assets/placeholder.svg\"
                alt=\"No image provided for ${project.title || "project"}\"
                loading=\"lazy\"
                decoding=\"async\"
              />
            </div>
          `;

        const tags = (project.stack || [])
          .map((item) => `<span class=\"tag\">${item}</span>`)
          .join("");

        const demoLink = project.demo
          ? `<a class=\"secondary\" href=\"${project.demo}\" target=\"_blank\" rel=\"noreferrer\">Live Demo</a>`
          : "";

        const repoUrl = typeof project.repo === "string" ? project.repo.trim() : "";
        const hasRepoLink = /^https?:\/\//i.test(repoUrl);
        const repoLabel = project.repoLabel || "Repository";
        const repoText = project.repoText || (repoUrl && !hasRepoLink ? repoUrl : "Repository not available");
        const repoMarkup = hasRepoLink
          ? `<a href=\"${repoUrl}\" target=\"_blank\" rel=\"noreferrer\">${repoLabel}</a>`
          : `<span class=\"link-note\">${repoText}</span>`;

        return `
          <article class=\"card\" style=\"animation-delay:${idx * 90}ms\">
            ${imageMarkup}
            <h3>${project.title || "Untitled Project"}</h3>
            <p>${project.description || "No description provided."}</p>
            <div class=\"meta\">${tags}</div>
            <div class=\"links\">
              ${repoMarkup}
              ${demoLink}
            </div>
          </article>
        `;
      })
      .join("");

    setupImageModal(container, projects);
  } catch (error) {
    container.innerHTML = "<p>Could not load projects. Check <code>projects.json</code>.</p>";
    console.error(error);
  }
}

function normalizeProjectImages(project) {
  const cleanPath = (value) => {
    if (typeof value !== "string") {
      return "";
    }
    const normalized = value.trim().replace(/\\/g, "/");
    return normalized ? encodeURI(normalized) : "";
  };

  if (Array.isArray(project.images)) {
    return project.images.map(cleanPath).filter((img) => img !== "");
  }

  if (Array.isArray(project.image)) {
    return project.image.map(cleanPath).filter((img) => img !== "");
  }

  if (typeof project.image === "string" && project.image.trim() !== "") {
    return [cleanPath(project.image)];
  }

  return [];
}

function setupImageModal(projectsContainer, projects) {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");
  const modalPrev = document.getElementById("modal-prev");
  const modalNext = document.getElementById("modal-next");
  const modalCounter = document.getElementById("modal-counter");

  if (!modal || !modalImage || !modalClose || !modalPrev || !modalNext || !modalCounter) {
    return;
  }

  const state = {
    images: [],
    index: 0,
    title: "Project image"
  };

  const renderModalImage = () => {
    const src = state.images[state.index] || "assets/placeholder.svg";
    modalImage.src = src;
    modalImage.alt = `${state.title} (${state.index + 1}/${state.images.length})`;
    modalCounter.textContent = `${state.index + 1} / ${state.images.length}`;

    const showNav = state.images.length > 1;
    modalPrev.classList.toggle("is-hidden", !showNav);
    modalNext.classList.toggle("is-hidden", !showNav);
  };

  const openModal = (images, startIndex, title) => {
    state.images = images.length > 0 ? images : ["assets/placeholder.svg"];
    state.index = Math.min(Math.max(startIndex, 0), state.images.length - 1);
    state.title = title || "Project image";
    renderModalImage();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImage.src = "";
  };

  const showPrevious = () => {
    if (state.images.length < 2) {
      return;
    }
    state.index = (state.index - 1 + state.images.length) % state.images.length;
    renderModalImage();
  };

  const showNext = () => {
    if (state.images.length < 2) {
      return;
    }
    state.index = (state.index + 1) % state.images.length;
    renderModalImage();
  };

  projectsContainer.addEventListener("click", (event) => {
    const trigger = event.target.closest(".image-trigger");
    if (!trigger) {
      return;
    }

    const projectIndex = Number(trigger.dataset.projectIndex);
    const project = projects[projectIndex] || {};
    const images = normalizeProjectImages(project);
    openModal(images, 0, project.title || "Project image");
  });

  modalClose.addEventListener("click", closeModal);
  modalPrev.addEventListener("click", showPrevious);
  modalNext.addEventListener("click", showNext);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowLeft") {
      showPrevious();
    } else if (event.key === "ArrowRight") {
      showNext();
    }
  });

  modalImage.addEventListener("error", () => {
    modalImage.src = "assets/placeholder.svg";
  });
}

loadProjects();
