import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTaskFromFile } from '../../lib/taskParser.js';
import { Task } from '../../lib/types/types.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

test('TaskParser Test', async (t) => {
    //
    const fileToParse = path.join(_dirname, 'fixtures/task-test.md');
    const taskGenerator = parseTaskFromFile({file:fileToParse});
    const tasksArray:Task[] = []
    await t.test('it shoumld generate the right number of tasks', async () => {
        for await (const task of taskGenerator) {
            tasksArray.push(task);
        }
        assert.equal(tasksArray.length,3);
        assert.equal(tasksArray[0].name, 'Setup Environment');
    });
    await t.test('it should throws an error if file does not exist', async () => {
        //TODO
    });
    //
});