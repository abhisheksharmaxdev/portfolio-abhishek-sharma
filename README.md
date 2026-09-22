# Abhishek Sharma — Portfolio

Personal portfolio of **Abhishek Sharma**, B.Tech Computer Science (Big Data Analytics) student at Ganpat University, building with AI/ML, data and software.

The site presents my projects, internship experience, skills and certifications, with an interactive 3D hero and case studies for each project.

## Highlights

- **Interactive 3D hero:** a WebGL particle field that morphs between a data sphere, a neural network and a loss landscape, and reacts to the cursor.
- **Project case studies:** problem, approach, contribution and results for each project, with every metric linked to its source.
- **Visuals built from real project outputs:** model comparison, shipment network and training curves.
- **Skill explorer:** select a skill to see which projects use it.
- **Live GitHub feed:** repositories load from the GitHub API, with a static fallback.
- **Dark and light themes**, a fully responsive layout, and support for reduced-motion settings.

## Tech stack

| Area | Tools |
|---|---|
| Framework | React 19, TypeScript, Vite |
| 3D | Three.js, React Three Fiber, custom GLSL shaders |
| Animation | Motion, Lenis (smooth scrolling) |
| Styling | Tailwind CSS v4 with CSS custom-property design tokens |

## Getting started

Requires **Node.js 20+**.

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
```

| Script | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Run the TypeScript compiler only |

## Project structure

```
src/
├── content/        Site content: profile, projects, experience, skills, certifications
├── sections/       Page sections (Hero, About, Experience, Projects, Skills, …)
├── components/
│   ├── layout/     Navbar, Footer, Loader, scroll progress, cursor glow
│   ├── three/      3D hero scene and point-cloud shape generators
│   ├── visuals/    Animated project illustrations
│   ├── projects/   Case-study dialog and its context provider
│   └── ui/         Shared primitives (Button, Icon, Reveal, SpotlightCard, …)
├── hooks/          Theme, media queries, active section, GitHub repositories
├── lib/            Small utilities and smooth-scroll helpers
├── config/         Environment-driven settings
└── styles/         Global styles and design tokens
```

## Editing content

All text and data shown on the site live in `src/content/`, so most updates don't require touching components.

| Task | File |
|---|---|
| Update bio, headline, email, social links or CV link | `src/content/profile.ts` |
| Add or edit a project | `src/content/projects.ts` |
| Add a certification or its verification link | `src/content/certifications.ts` |
| Update experience or add a certificate link | `src/content/experience.ts` |
| Edit skills | `src/content/skills.ts` |

New projects can reuse an existing visual. To create a new one, add a component to `src/components/visuals/` and register it in `ProjectVisual.tsx`.

## Configuration

Optional environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `VITE_FORMSPREE_ID` | [Formspree](https://formspree.io) form ID. When set, the contact form sends messages directly to my inbox. When empty, it opens the visitor's email client with the message pre-filled. |

For local development, copy `.env.example` to `.env.local`. In production, set the variable in your hosting provider's dashboard.

## Deployment

`npm run build` produces a static site in `dist/` that works on any static host. No domain is hard-coded.

- **Vercel:** import the repository. Vite is detected automatically, and `vercel.json` sets caching headers.
- **Netlify:** import the repository. `netlify.toml` contains the build settings.
- **GitHub Pages:** enable *Settings → Pages → Source: GitHub Actions*. The included workflow builds and deploys on every push to `main` and sets the base path to `/<repo-name>/`. For a `<username>.github.io` repository, change `BASE_PATH` in the workflow to `/`.

## Accessibility and performance

- Semantic landmarks, a skip link and visible focus styles.
- The case-study dialog traps focus, closes with Esc and returns focus when closed.
- Honours `prefers-reduced-motion`: smooth scrolling, auto-morphing and marquee motion are turned off.
- The 3D scene is lazy-loaded in its own chunk, pauses when off-screen, uses fewer particles on small screens, and falls back to a static gradient if WebGL is unavailable.

## Contact

- Email: [abhisheksharmaxdev@gmail.com](mailto:abhisheksharmaxdev@gmail.com)
- LinkedIn: [abhishek-sharma-xdev](https://www.linkedin.com/in/abhishek-sharma-xdev)
- GitHub: [abhisheksharmaxdev](https://github.com/abhisheksharmaxdev)

---

© Abhishek Sharma. The source code is shared for reference. Please don't reuse the personal content (text, project descriptions) as your own.
