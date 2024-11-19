# VURFC Development Guide

This guide explains how to work with this Astro website project. Follow these steps to contribute new features, fix bugs, or make improvements.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Development Workflow

### Branch Names

Use descriptive names in kebab-case that briefly describe the feature or fix:

- add-dark-mode
- fix-mobile-nav
- update-blog-layout
- redesign-footer

### Commit Message Guidelines

Follow these conventions for commit messages:

| Commit prefix | Description           |
| :------------ | :-------------------- |
| `feat:`       | New features or pages |
| `fix:`        | Bug fixes             |
| `docs:`       | Documentation changes |
| `style:`      | Code style changes    |
| `refactor:`   | Code refactoring      |
| `test:`       | Adding tests          |
| `chore:`      | Maintenance tasks     |

### Prepare your branch:

| Command                            | Action                                                 |
| :--------------------------------- | :----------------------------------------------------- |
| `git checkout main`                | Switch to the main branch to ensure you're up to date  |
| `git pull`                         | Download latest changes from the remote main branch    |
| `git checkout -b your-branch-name` | Create and switch to a new branch for your feature/fix |

### Make your changes:

| Command                                            | Action                                              |
| :------------------------------------------------- | :-------------------------------------------------- |
| `npm run dev`                                      | Start local development server to preview changes   |
| `git add .`                                        | Stage all modified and new files for commit         |
| `git commit -m "message here"`                     | Save your changes with a descriptive commit message |
| `git push --set-upstream origin your-feature-name` | Push new branch to remote (first time only)         |
| `git push`                                         | Push new commits to your remote branch              |

### Creating Pull Requests

1. Go to the repository on GitHub and click "Compare & pull request"
2. Fill in the PR template:

- Title: Use the same convention as commit messages (e.g., "feat: add dark mode")
- Description:
  - What does this PR do?
  - Any specific testing instructions?
  - Screenshots (if applicable)
  - Related issues (if any)

3. Submit the pull request

### Reviewing PRs

Before requesting review:

- Run npm run build to ensure it builds successfully
- Test the feature locally
- Add relevant screenshots/videos if UI changes
- Ensure all commits follow naming convention
- Update documentation if needed

### Merging PRs

Once approved:

1. Update your branch with main (if needed):

| Command                         | Action                                             |
| :------------------------------ | :------------------------------------------------- |
| `git checkout main`             | Switch back to the main branch                     |
| `git pull origin main`          | Get latest changes from remote main branch         |
| `git checkout your-branch-name` | Switch back to your feature branch                 |
| `git merge main`                | Merge latest main changes into your feature branch |

2. Resolve any conflicts if they exist
3. Push final changes: `git push origin your-branch-name`
4. On Github:
   - Choose "Squash and merge"
   - Update the squash commit message to follow conventions
   - Click "Confirm squash and merge"
   - Click "Delete branch" in the PR

## 👀 Want to learn more about Astro?

Feel free to check [our documentation](https://docs.astro.build).
