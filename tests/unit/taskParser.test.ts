import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFile } from '../../taskParser.js';


const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

test('TaskParser Test', async (t) => {

    const fileToParse = path.join(_dirname, '..', '..', 'fixtures/task.md');

    await t.test('it should return the correct dictionnary', async (t) => {
        const tasksDict = await parseFile(fileToParse);
        const result = {
            subtask: [
                {
                    name: 'Install required software (Node.js, Git)',
                    status: '-'
                },
                {
                    name: 'Set up project repository',
                    status: '/'
                },
                {
                    name: 'Initialize the project with `npm init`',
                    status: 'x'
                }
            ]
        }
        assert.equal(typeof tasksDict, 'object');
        assert.deepStrictEqual(Object.keys(tasksDict), ['Setup Environment', 'Implement Basic Features', 'Style and Design']);
        assert.deepStrictEqual(tasksDict[Object.keys(tasksDict)[0]], result);
    });

    await t.test('It must throw an error if incorrect filePath is given', async (t) => {
        assert.rejects(async () => {
            await parseFile('/wrongPath')
        }, Error);
    });
});