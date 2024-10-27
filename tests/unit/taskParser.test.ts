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
    const tasksArray:Task[] = [];
    //TODO test error handling case
    await t.test('it should generate the right number of tasks', async () => {
        for await (const task of taskGenerator) {
            tasksArray.push(task);
        }
        assert.equal(tasksArray.length,3);
        assert.equal(tasksArray[0].name, 'Setup Environment');
        assert.equal(tasksArray[1].subtasks.length, 4);
    });
    await t.test('it should calc the progress correctly', async () => {
        assert.equal(tasksArray[0].percentage,100);
        assert.equal(tasksArray[1].percentage,25);
    });
});