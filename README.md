# taskify

## A Simple Task Manager Application

> **WARNING:** This application is currently under development. Do not use yet!

## Overview

This project is a Task Manager Application that parses a `README.md` file to extract and manage 
tasks and subtasks dynamically. 
It uses Node.js to read and process the file, allowing you to update 
task progress through a simple Markdown interface.

The application supports tasks and subtasks with three statuses:
- `Pending` (task not started)
- `In Progress` (task is currently being worked on)
- `Complete` (task completed)

The progress for each task is automatically calculated based on the number of completed subtasks.

## Features

- **Parse tasks and subtasks from a README file**
- **Track task progress with three states: `Pending`, `In Progress`, `Complete`**
- **Calculate and display task completion percentage**
- **Read large files line-by-line using Node.js streams and async generator for memory efficiency and lazy loading task**

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
- [x] TaskParser function:parse task and subtask from a md file
- [x] Add watcher class: watch file change
- [x] Add watch, check, template command to cli
- [ ] Refactor and improve print functionnality and fix console output update when clearing terminal
- [ ] Add support for editing tasks directly from the cli (edit,delete,update)
- [ ] Implement a UI for better interaction with tasks (fastify server or api)

## License
This project is licensed under the MIT License.

# Important: This application is still in development and is not ready for production use.

