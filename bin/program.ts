#! /usr/bin/env node
import process from 'node:process';
import { Command } from 'commander';
import { watchCommand } from '../lib/commands/watch.command.js';
import { templateCommand } from '../lib/commands/template.command.js';
import { checkCommand } from '../lib/commands/check-command.js';
import constants from '../lib/constants.js';


const { version,pName} = constants;

const program = new Command();

program
.name(pName)
.description('CLI for managing task files from a .md file')
.version(version);

program.addCommand(templateCommand);
program.addCommand(checkCommand);
program.addCommand(watchCommand);

program.parse(process.argv);