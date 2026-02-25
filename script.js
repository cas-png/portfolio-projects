async function loadProjects() {
  const container = document.getElementById("projects");

  try {
    const response = await fetch("projects.json", { cache: "no-store" });
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
        const hasImage = Boolean(project.image);
        const imageSrc = hasImage ? project.image : "assets/placeholder.svg";
        const imageAlt = `${project.title || "Project"} preview`;
        const imageMarkup = hasImage
          ? `
            <button class=\"card-image image-trigger\" type=\"button\" data-image=\"${imageSrc}\" data-alt=\"${imageAlt}\" aria-label=\"Open larger image for ${project.title || "project"}\">
              <img
                src=\"${imageSrc}\"
                alt=\"${imageAlt}\"
                loading=\"lazy\"
                decoding=\"async\"
                onerror=\"this.onerror=null;this.src='assets/placeholder.svg';this.parentElement.classList.add('is-placeholder');\"
              />
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

    setupImageModal(container);
  } catch (error) {
    container.innerHTML = "<p>Could not load projects. Check <code>projects.json</code>.</p>";
    console.error(error);
  }
}

function setupImageModal(projectsContainer) {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");
  if (!modal || !modalImage || !modalClose) {
    return;
  }

  const openModal = (src, alt) => {
    modalImage.src = src;
    modalImage.alt = alt;
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

  projectsContainer.addEventListener("click", (event) => {
    const trigger = event.target.closest(".image-trigger");
    if (!trigger) {
      return;
    }

    openModal(trigger.dataset.image, trigger.dataset.alt || "Project image");
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

loadProjects();
