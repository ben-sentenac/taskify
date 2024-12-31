// src/commands/template.ts
import { Command } from 'commander';
import cliColor from 'cli-color';

export const templateCommand = new Command('template')
    .description('Show template and editing instructions for .md file')
    .action(() => {
        console.log('_'.repeat(50) + '\n');
        console.log(`To edit your .md file, use the following format:\n`);

        console.log(`### Task Format:
${cliColor.blue(`---

# Task: <Task Name>
- [ ] Subtask 1
- [x] Subtask 2
- [/] Subtask 3

---`)}
`);

        console.log(`### Formatting Guide:
- ${cliColor.red('only the section between **---**(tree dashes) delimiter will be parsed')}  
- Begin each task with a line starting with **# Task: <Task Name>**.
- For each subtask, use the following symbols in square brackets:
  - **[ ]** for "pending"
  - **[x]** for "complete"
  - **[/]** for "in-progress"
`);

        console.log(`### Example .tasks.md File:
${cliColor.blue(`---

# Task: Set up project
- [ ] Install dependencies
- [x] Set up Git repository
- [/] Configure ESLint

# Task: Implement feature
- [ ] Write feature code
- [ ] Write tests
- [ ] Document feature

---`)}
`); console.log(`This structure allows the CLI to parse tasks and display completion status correctly.\n`);
    });
