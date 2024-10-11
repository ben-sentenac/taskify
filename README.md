# taskify

## A Simple Task Manager Application

> **WARNING:** This application is currently under development. Do not use yet!

## Overview

This project is a Task Manager Application that parses a `README.md` file to extract and manage 
tasks and subtasks dynamically. 
It uses Node.js to read and process the file, allowing you to update 
task progress through a simple Markdown interface.

The application supports tasks and subtasks with three statuses:
- `To Do` (task not started)
- `In Progress` (task is currently being worked on)
- `Done` (task completed)

The progress for each task is automatically calculated based on the number of completed subtasks.

## Features

- **Parse tasks and subtasks from a README file**
- **Track task progress with three states: `To Do`, `In Progress`, `Done`**
- **Calculate and display task completion percentage**
- **Read large files line-by-line using Node.js streams for memory efficiency**

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)

### Steps

1. Clone the repository:
```bash
    git clone https://github.com/your-username/task-manager-app.git
    cd task-manager-app
```
2. Install dependencies:
```bash
    npm install
```
3. run application:
```bash
  npm run dev
```

### Usage

To use the Task Manager App, ensure your `README.md` follows the task structure:
```md

<!--
Note that for now  only the content between --- delimiter will be parsed
-->

--- 

# Task: Task Name (33%)
- [-] Subtask To Do started
- [/] Subtask in progress
- [x] Subtask completed



# Task: Another Task (50%)
- [-] Another subtask
- [/] Another in progress subtask
- [x] Completed subtask

---

```

The application will parse the tasks and output their progress and status.

## Roadmap 

> [ ] Add support for editing tasks directly from the app
> [ ] Implement a UI for better interaction with tasks
> [ ] Add automated tests

## License
This project is licensed under the MIT License.

# Important: This application is still in development and is not ready for production use.


### Key Sections:
- **Warning:** Added at the top to inform users that the project is under development.
- **Overview:** A brief explanation of what the project does and its current features.
- **Installation:** Steps for installing and running the project.
- **Usage:** A guide on how to structure the `README.md` file for parsing tasks.
- **Roadmap:** Future features to be added.
- **License:** Project is licensed under MIT.
