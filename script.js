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
        const imageSrc = project.image || "assets/placeholder.svg";
        const imageClass = project.image ? "card-image" : "card-image is-placeholder";
        const tags = (project.stack || [])
          .map((item) => `<span class=\"tag\">${item}</span>`)
          .join("");

        const demoLink = project.demo
          ? `<a class=\"secondary\" href=\"${project.demo}\" target=\"_blank\" rel=\"noreferrer\">Live Demo</a>`
          : "";

        return `
          <article class=\"card\" style=\"animation-delay:${idx * 90}ms\">
            <div class=\"${imageClass}\">
              <img
                src=\"${imageSrc}\"
                alt=\"${project.title || "Project"} preview\"
                loading=\"lazy\"
                decoding=\"async\"
                onerror=\"this.onerror=null;this.src='assets/placeholder.svg';this.parentElement.classList.add('is-placeholder');\"
              />
            </div>
            <h3>${project.title || "Untitled Project"}</h3>
            <p>${project.description || "No description provided."}</p>
            <div class=\"meta\">${tags}</div>
            <div class=\"links\">
              <a href=\"${project.repo || "#"}\" target=\"_blank\" rel=\"noreferrer\">Repository</a>
              ${demoLink}
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    container.innerHTML = "<p>Could not load projects. Check <code>projects.json</code>.</p>";
    console.error(error);
  }
}

loadProjects();
