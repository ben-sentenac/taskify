#! /usr/bin/env node
import process from 'node:process';
import { join } from 'node:path';
import { Command } from 'commander';
import { watchCommand } from '../lib/commands/watch.command.js';
import figlet from 'figlet';

const program = new Command();

program
.name('Task-cli')
.description('CLI for managing task files')
.version('1.0.0');

program.addCommand(watchCommand);

program.parse(process.argv);