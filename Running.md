# Running the project

You "run" this project by opening the repo in VS Code, enabling GitHub Copilot Agents, and then triggering one of your prompt files (e.g., `update_all_docs.prompt.md`).
Copilot will automatically execute the agent, follow the instructions, and use the skills.

## How the Project Runs (Step-by-Step)

1. Clone this repo
2. Open VS Code with GitHub Copilot enabled
    - You need:
        - GitHub Copilot Chat extension
        - GitHub Copilot Agents enabled in settings
        - A GitHub account with Copilot access
    - VS Code automatically detects:
        - `.agent.md` files → define agents
        - `SKILL.md` files → define skills
        - `instructions/*.md` → step-by-step workflows
        - `prompts/*.md` → triggerable tasks
3. Trigger an agent using a prompt file
    - Method 1:
        - Open the `.github/prompts/update_all_docs.prompt.md`
        - Click **Run with Copilot**
            - This is the play button at the top right of the text editor area.
        - Copilot will
            - Load the agent (`todo-doc-writer.agent.md`)
            - Read the instructions
            - Execute skills (`scan_api.js`, `scan_frontend.js`, etc.)
            - Update documentation files in `/docs`
        - Other prompts can be triggered in the same way
            - `update_all_docs.prompt.md`
            - `generate_mermaid.prompt.md`
    - Method 2:
        - From the Copilot Chat window type in `/update_all_docs`
4. Run the step-by-step project creation
    - Each instruction file is a "recipe" Copilot follows.
        - e.g.
            - `01-init-project.md`
            - Open it → click Run with Copilot
                - Copilot will create:
                    - `/src/backend`
                    - `/src/frontend`
                    - `/src/datastore`
                    - `README`
    - Then run 02, 03, 04, 05 and 06
        - You can run one at a time or chain them.

5. Run the actual Todo application
    - Once all instructions have been completed you can run the program as follows;
    - Backend
        ```sh
        cd src/backend
        npm install
        npm run start
        ```
    - Frontend
        ```sh
        cd src/frontend
        npm install
        npm run dev
        ```
    - Database
        This will depend on what Copilot generated.

## How Copilot Agents Actually Work

### Agents

Your agent (todo-doc-writer.agent.md) defines the persona and responsibilities.

### Skills

Each skill is a small script that extracts information from the codebase.

### Instructions

These tell Copilot how to build the project step-by-step.

### Prompts

These trigger the agent to perform a task.