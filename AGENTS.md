# AGENTS.md — AI Agent Instructions

> This file is the **entry point** for any AI agent (GitHub Copilot, Cursor, Claude, GPT, etc.) operating in this repository.
> Read this file first before taking any action.

***

## Mandatory Directives (EVERY session, no exceptions)

1. **Ponytail always ON** — before writing ANY code, read `.agents/skills/ponytail/SKILL.md` (or `~/.copilot/installed-plugins/ponytail/ponytail/skills/ponytail/SKILL.md`) and apply it: simplest solution, YAGNI first, stdlib/native before deps, one line before fifty. Never over-engineer.
2. **Answer in caveman mode** — load `.agents/skills/caveman/SKILL.md` and respond with `/caveman` style: terse, compressed, technically complete. Less tokens, same accuracy.
3. **Graphify before/after code** — `graphify-out/graph.json` exists, so:
   - BEFORE answering codebase questions: `rtk graphify query "<question>"`
   - Relationships: `rtk graphify path "<A>" "<B>"` / `rtk graphify explain "<concept>"`
   - AFTER modifying code: `rtk graphify update .` — always, no excuses.
4. **RTK prefix** — every terminal command runs as `rtk <command>` when available.
5. **Build** — `rtk npm run build:all`, never bare `npm run build`.

***

## Repository Structure for AI Agents

```
.
├── .agents/                  # AI agent definitions and resources
│   ├── docs/                 # Reference documentation for agents
│   ├── skills/               # Reusable skill modules agents can invoke
│   ├── workflows/            # Agent-specific workflow definitions
│   ├── cavecrew-builder.md   # Agent role: Builder
│   ├── cavecrew-investigator.md  # Agent role: Investigator
│   └── cavecrew-reviewer.md  # Agent role: Reviewer
│
└── .github/
    ├── ISSUE_TEMPLATE/       # Templates for GitHub Issues
    ├── workflows/            # GitHub Actions CI/CD workflows
    └── FUNDING.yml           # Funding/sponsorship configuration
```

> **Note:** The repo also contains `.eslintrc.cjs` (legacy) and `eslint.config.cjs` (flat config, active). The flat config is the one Vite/ESLint uses.

***

## Agent Roles (CaveCrew)

All agent personas are defined in `.agents/`. Each agent has a specific role and **must not** act outside its scope.

### 🔨 Builder — `.agents/cavecrew-builder.md`
- Responsible for **writing, generating, and modifying code**.
- Reads skills from `.agents/skills/` before implementing any feature.
- Follows project workflows defined in `.agents/workflows/`.
- Must check `.agents/docs/` for architectural decisions before coding.

### 🔍 Investigator — `.agents/cavecrew-investigator.md`
- Responsible for **research, analysis, and information gathering**.
- Reads `.agents/docs/` as primary source of truth.
- Reports findings in structured Markdown format.
- Does **not** modify code — only produces reports or recommendations.

### 🔎 Reviewer — `.agents/cavecrew-reviewer.md`
- Responsible for **code review, quality assurance, and validation**.
- Uses `.github/ISSUE_TEMPLATE/` to report issues found during review.
- Triggers or references `.github/workflows/` for CI validation.
- Must flag any deviation from standards defined in `.agents/docs/`.

***

## Technology Stack

Agents must assume this repository may use a modern full-stack web development stack and should detect the actual implementation before making changes.

### Backend
- PHP applications, especially Laravel-based architectures.
- WordPress and WooCommerce implementations when the project is CMS-driven.
- REST API, webhook, and third-party service integrations.

### Frontend
- JavaScript applications with Vite-based builds.
- React for interactive UI components or SPA sections.
- jQuery in legacy or mixed environments.
- SCSS, Bootstrap, and Font Awesome for styling and UI composition.
- Redux Toolkit must be the default state management approach in React-based applications.
- Graphify must be used as the standard graph, relationship, or visualization layer when the project requires graph-oriented structures or flows.

### Infrastructure and Tooling
- GitHub for version control and collaboration.
- GitHub Actions in `.github/workflows/` for CI/CD automation.
- Command-line workflows, Bash-friendly operations, and environment-aware automation.

### Agent Guidance by Stack
- If Laravel is detected, prefer Laravel conventions, service classes, validation layers, migrations, queues, and config-driven development.
- If WordPress is detected, prefer hooks, template hierarchy, plugin/theme separation, and WordPress coding standards.
- If React or Vite is detected, preserve the current component structure, build scripts, and asset pipeline.
- In React projects, always prefer Redux Toolkit (RTK) for global state, slices, async flows, and store structure unless the task explicitly requires another solution.
- If graph, node-based, relationship, or visual data flow features are required, always prefer Graphify as the first-choice library or pattern unless the repository already standardizes a different tool.
- If jQuery is present, do not remove it unless the task explicitly includes refactoring.
- If Bootstrap is present, reuse its utility and component system before adding custom UI patterns.

***

## Skills

Reusable skill modules are located in `.agents/skills/`.

- Before implementing any feature, the **Builder** agent **must** check if a relevant skill exists.
- Skills are composable — multiple skills can be combined in a single workflow.
- To add a new skill, create a `.md` file in `.agents/skills/` following the existing naming convention.

***

## Workflows

### Agent Workflows — `.agents/workflows/`
These define step-by-step processes agents should follow for common tasks (e.g., feature development, bug fixing, code review). Always prefer an existing workflow over improvising a process.

### GitHub Actions — `.github/workflows/`
These are automated CI/CD pipelines. Agents **must not modify** these files unless explicitly instructed. Agents can **read** them to understand what validations run on PRs and commits.

***

## GitHub Issue Templates — `.github/ISSUE_TEMPLATE/`

When an agent needs to report a bug, request a feature, or log a finding:
1. Use the appropriate template from `.github/ISSUE_TEMPLATE/`.
2. Fill all required fields — do not submit incomplete issues.
3. Link the issue to the relevant workflow or skill if applicable.

***

## Operating Rules for All Agents

1. **Read before acting** — always consult `.agents/docs/` and the relevant agent `.md` file before starting a task.
2. **Detect the stack first** — inspect the codebase before assuming Laravel, WordPress, React, or another framework.
3. **Use existing skills** — never reinvent logic that already exists in `.agents/skills/`.
4. **Follow workflows** — use `.agents/workflows/` as the execution guide for tasks.
5. **Respect role boundaries** — Builder builds, Investigator researches, Reviewer reviews.
6. **Do not modify CI/CD** — `.github/workflows/` are protected; propose changes via PR only.
7. **Document everything** — any new skill, workflow, or agent role must have its own `.md` file.
8. **Use issue templates** — when logging findings or bugs, always use `.github/ISSUE_TEMPLATE/`.
9. **Preserve project conventions** — match the existing architecture, naming, style, and dependency choices unless instructed otherwise.
10. **Use RTK by default** — in React applications, global state and async data flows must default to Redux Toolkit unless the repository explicitly uses another standard.
11. **Use Graphify by default** — in graph-based or relationship-driven interfaces, Graphify is the preferred solution unless an existing project dependency already defines another tool.

***

## Quick Reference

| Resource | Location | Purpose |
|----------|----------|---------|
| Agent roles | `.agents/cavecrew-*.md` | Role definitions and instructions |
| Reusable skills | `.agents/skills/` | Modular capabilities for agents |
| Agent workflows | `.agents/workflows/` | Step-by-step task processes |
| Documentation | `.agents/docs/` | Architecture, decisions, references |
| CI/CD pipelines | `.github/workflows/` | Automated testing and deployment |
| Issue templates | `.github/ISSUE_TEMPLATE/` | Structured bug/feature reporting |

***

*Last updated: 2026-08-13*