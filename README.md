# Project Portfolio (GitHub Pages)

Simple portfolio site to showcase school and side projects.

## 1) Customize content

- Update your name and intro text in `index.html`.
- Update GitHub profile link in `index.html`.
- Replace sample entries in `projects.json` with your own projects.
- Add project screenshots to `assets/` and set each project's `image` path.

`projects.json` format:

```json
[
  {
    "title": "Project Name",
    "description": "What it does and why it matters",
    "stack": ["Tech1", "Tech2"],
    "image": "assets/project-image.jpg",
    "repo": "https://github.com/your-username/your-repo",
    "demo": "https://your-demo-link.com"
  }
]
```

If you do not have a live demo, keep `"demo": ""`.

## 2) Publish with GitHub Pages

1. Create a GitHub repository (example: `portfolio-projects`).
2. Push this folder to GitHub:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

3. On GitHub: `Settings` -> `Pages`.
4. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main` and folder `/ (root)`
5. Save. Your site will be available at:
   - `https://<your-username>.github.io/<repo-name>/`

## 3) Update projects later

Edit `projects.json`, commit, and push:

```bash
git add projects.json
git commit -m "Update portfolio projects"
git push
```

GitHub Pages will redeploy automatically.
