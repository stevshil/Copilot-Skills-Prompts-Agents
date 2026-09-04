# Things you might want to try

1. Running the project to create the actual application

2. Asking Copilot to see if there are any opportunities for ceating MCP functions.  Try the following prompt, in plan mode;
    ```
    review the project and identify any potential mcp functions that could be added for this project.
    ```

    - Most will relate to the creation of the components.
    - Highest value:
        - inspect_project_structure
        - validate_copilot_workflows
        - report_documentation_drift
    - Later stages
        - generate_mermaid_context

3. If you like the plan, have Copilot start the implementation of the MCP functions.

4. Ask Copilot if there are any issues with the current template that should be resolved.  Fixes may include;
    - scan_api.js not having all required HTTP methods.
    - various naming issues in the JS files compared to the spec.