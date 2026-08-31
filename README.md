# Todo's project

This is an example Copilot project that will use;
- Agents
- Prompts
- Skills
- Instructions

The aim is to see how you can build a project purely from GitHub Copilot features.

The **instructions** are the part that would create the project.  These are split into individual files so as to not overload the AI.  Most people make the mistake of providing a single prompt and expecting the AI to build the entire project.

> **NOTE:** A single prompt would leave your project vulnerable, as you would not have provided the security requirements, and other features to ensure that your code is safe from attack, or known vulnerabilities.

# The project

Designed to maintain and update documentation, generate diagrams, and orchestrate a **multi‑user Todo List** application where:
- Each user sees only their own todos
- Users may mark items as public, visible to everyone
- Copilot can create and update all documentation files automatically

This will give you a full working Copilot Agent Mode project scaffold, ready to drop into a repo.

## The Layout

```
/.github/
  /agents/
    todo-doc-writer.agent.md
  /skills/
    update-rest-api-docs/
      SKILL.md
      scan_api.js
    update-frontend-docs/
      SKILL.md
      scan_frontend.js
    update-data-store-docs/
      SKILL.md
      scan_datastore.js
    update-user-docs/
      SKILL.md
      generate_user_docs.js
  /instructions/
    01-init-project.md
    02-generate-backend.md
    03-generate-frontend.md
    04-generate-datastore.md
    05-generate-docs.md
    06-generate-mermaid.md
  /prompts/
    update_all_docs.prompt.md
    generate_mermaid.prompt.md

/docs/
  REST_API.md
  FRONTEND.md
  DATA_STORE.md
  USER_GUIDE.md

/src/
  backend/
  frontend/
  datastore/
```

## 1. The Agent — "todo-doc-writer.agent.md"

This agent acts as your technical writer, responsible for updating all documentation files.

- This is the persistent persona that always handles documentation tasks.
    - [todo-doc-writer.agent.md](.github/agents/todo-doc-writer.agent.md)

## 2. Skills — Four Skills, One Per Documentation Domain

Each skill contains:
- A SKILL.md describing the workflow
- A script that extracts metadata from the codebase

### Skills

- **Skill 1: [update-rest-api-docs](.github/skills/update-rest-api-docs/**
- **Skill 2: [update-frontend-docs](.github/skills/update-frontend-docs/)**
- **Skill 3: [update-data-store-docs](.github/skills/update-data-store-docs/)**
- **Skill 4: [update-user-docs](.github/skills/update-user-docs/)**

## 3. Instructions — Step-by-Step Project Creation

These are the files Copilot uses to build the project in order.

- **[.github/instructions](.github/instructions/)**

# Running

To run the project see: [Running the project](Running.md)