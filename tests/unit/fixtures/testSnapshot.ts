import { SnapShot } from "../../../lib/types/types.js";

export const testSnapshot:SnapShot = {
    "Setup Environment": {
      "name":"Setup Environment",
      "percentage": 33,
      "subtasks": [
        {"name": "Install required software (Node.js, Git)", "status": "TODO"},
        {"name": "Set up project repository", "status": "IN_PROGRESS"},
        {"name": "Initialize the project with `npm init`", "status": "DONE"}
      ]
    },
    "Implement Basic Features": {
      "name": "Implement Basic Features",
      "percentage": 50,
      "subtasks": [
        {"name": "Create task input form", "status": "TODO"},
        {"name": "Add functionality to add new tasks", "status": "IN_PROGRESS"},
        {"name": "Implement task deletion", "status": "DONE"},
        {"name": "Add task completion toggle", "status": "DONE"}
      ]
    },
    "Style and Design": {
      "name":"Style and Design",
      "percentage": 0,
      "subtasks": [
        {"name": "Create basic layout and style using CSS", "status": "TODO"},
        {"name": "Make the app responsive", "status": "TODO"},
        {"name": "Add animations for task actions", "status": "TODO"}
      ]
    }
  }