---
name: generate-frontend
description: Generates the ReactJS frontend for the multi-user Todo List application.
---

This skill generates and maintains the ReactJS frontend codebase.

The frontend must support:

- User authentication (login + logout)
- Viewing private todos (only the logged-in user's items)
- Viewing public todos (items marked public by other users)
- Creating, editing, deleting todos
- Marking todos as public or private
- React state management and API integration
- A clean component structure

The skill outputs a structured JSON object containing:
- File paths
- File contents
- Component definitions
- API integration logic
- Routing structure

The agent will merge or create files based on this output.
