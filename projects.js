const projectDataUrl = "content/projects.json";

function element(tag, className, text) {
  const node = document.createElement(tag);

  if (className) {
    node.className = className;
  }

  if (text !== undefined) {
    node.textContent = text;
  }

  return node;
}

function projectUrl(project) {
  return `project.html?id=${encodeURIComponent(project.id)}`;
}

function projectCard(project, index, featured = false) {
  const article = element("article", featured ? "project-card project-card-featured" : "project-card");
  const link = element("a", "project-card-link");
  const media = element("div", "project-card-media");
  const image = document.createElement("img");
  const body = element("div", "project-card-body");
  const meta = element("div", "project-card-meta");
  const title = element("h3", "", project.title);
  const description = element("p", "", project.shortDescription);
  const action = element("span", "project-card-action", "View project");

  link.href = projectUrl(project);
  image.src = project.coverImage;
  image.alt = project.title;
  image.loading = featured && index === 0 ? "eager" : "lazy";
  meta.append(element("span", "", String(index + 1).padStart(2, "0")));
  meta.append(element("span", "", project.category));
  meta.append(element("span", "", project.year));
  media.append(image);
  action.append(element("span", "", " ↗"));
  body.append(meta, title, description, action);
  link.append(media, body);
  article.append(link);

  return article;
}

function renderProjectList(projects) {
  const grid = document.querySelector("[data-project-grid]");

  if (grid) {
    grid.replaceChildren(...projects.map((project, index) => projectCard(project, index)));
  }

  const homeGrid = document.querySelector("[data-home-projects]");

  if (homeGrid) {
    const featured = projects.filter((project) => project.featured).slice(0, 2);
    const selected = featured.length ? featured : projects.slice(0, 2);
    homeGrid.replaceChildren(...selected.map((project, index) => projectCard(project, index, true)));
  }
}

function detailRow(number, title, copy) {
  const row = element("article", "project-detail-row");
  row.append(element("span", "", number));
  row.append(element("h2", "", title));
  row.append(element("p", "", copy));
  return row;
}

function renderProjectDetail(project) {
  const main = document.querySelector("[data-project-detail]");

  if (!main) {
    return;
  }

  document.title = `${project.title} | EmbedLancer`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  descriptionMeta?.setAttribute("content", project.shortDescription);

  const hero = element("section", "project-detail-hero");
  const heroImage = document.createElement("img");
  const heroShade = element("div", "project-detail-shade");
  const heroCopy = element("div", "project-detail-hero-copy");
  const heroMeta = element("div", "project-detail-meta");

  heroImage.src = project.coverImage;
  heroImage.alt = project.title;
  heroMeta.append(element("span", "", project.category), element("span", "", project.year), element("span", "", project.status));
  heroCopy.append(element("p", "eyebrow eyebrow-light", "Project case study"), element("h1", "", project.title), element("p", "", project.shortDescription), heroMeta);
  hero.append(heroImage, heroShade, heroCopy);

  const overview = element("section", "project-overview");
  const overviewLabel = element("div", "project-overview-label");
  const overviewCopy = element("div", "project-overview-copy");
  const services = element("ul", "project-service-list");
  overviewLabel.append(element("span", "", "Scope"), element("strong", "", "Integrated product development"));
  overviewCopy.append(element("p", "project-lead", project.description));
  (project.services || []).forEach((service) => services.append(element("li", "", service)));
  overviewCopy.append(services);
  overview.append(overviewLabel, overviewCopy);

  const story = element("section", "project-story");
  story.append(
    detailRow("01", "Challenge", project.challenge),
    detailRow("02", "Engineering response", project.solution),
    detailRow("03", "Outcome", project.outcome)
  );

  const gallery = element("section", "project-gallery");
  const galleryHeading = element("div", "project-gallery-heading");
  const galleryGrid = element("div", "project-gallery-grid");
  galleryHeading.append(element("p", "eyebrow", "Product gallery"), element("h2", "", "The system in context."));
  (project.gallery || []).forEach((item) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.caption || project.title;
    image.loading = "lazy";
    figure.append(image, element("figcaption", "", item.caption || project.title));
    galleryGrid.append(figure);
  });
  gallery.append(galleryHeading, galleryGrid);

  const next = element("section", "project-next");
  const nextCopy = element("div", "");
  const nextLink = element("a", "button primary", "View all projects");
  nextCopy.append(element("p", "eyebrow", "Continue exploring"), element("h2", "", "More embedded development work."));
  nextLink.href = "projects.html";
  next.append(nextCopy, nextLink);

  main.replaceChildren(hero, overview, story, gallery, next);
}

function renderProjectError(message) {
  const detail = document.querySelector("[data-project-detail]");
  const grid = document.querySelector("[data-project-grid]");
  const homeGrid = document.querySelector("[data-home-projects]");

  if (detail) {
    const error = element("section", "project-error");
    const link = element("a", "button primary", "Return to portfolio");
    link.href = "projects.html";
    error.append(element("p", "eyebrow", "Project unavailable"), element("h1", "", message), link);
    detail.replaceChildren(error);
  }

  [grid, homeGrid].filter(Boolean).forEach((container) => {
    container.replaceChildren(element("p", "content-loading", "Projects could not be loaded. Please try again shortly."));
  });
}

async function loadProjects() {
  if (!document.querySelector("[data-project-grid], [data-home-projects], [data-project-detail]")) {
    return;
  }

  try {
    const response = await fetch(projectDataUrl, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error("Project data request failed");
    }

    const data = await response.json();
    const projects = Array.isArray(data.projects) ? data.projects : [];

    renderProjectList(projects);

    const detail = document.querySelector("[data-project-detail]");

    if (detail) {
      const id = new URLSearchParams(window.location.search).get("id");
      const project = projects.find((item) => item.id === id);

      if (!project) {
        renderProjectError("We could not find that project.");
        return;
      }

      renderProjectDetail(project);
    }
  } catch (error) {
    renderProjectError("The project content is temporarily unavailable.");
  }
}

loadProjects();
