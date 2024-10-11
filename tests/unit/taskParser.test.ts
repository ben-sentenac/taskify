import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFile } from '../../lib/taskParser.js';
import { deleteFile, generateTaskListToFile } from '../utils/utils-tests.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

test('TaskParser Test', async (t) => {

    const fileToParse = path.join(_dirname, 'fixtures/task-test.md');

    await t.test('it should return the correct dictionnary', async (t) => {
        const tasksDict = await parseFile(fileToParse);
        const result = {
            percentage: 100,
            subtasks: [
                {
                    name: 'Install required software (Node.js, Git)',
                    status: 'DONE'
                },
                {
                    name: 'Set up project repository',
                    status: 'DONE'
                },
                {
                    name: 'Initialize the project with `npm init`',
                    status: 'DONE'
                }
            ]
        }

        assert.deepStrictEqual(Object.keys(tasksDict), ['Setup Environment', 'Implement Basic Features', 'Style and Design']);
        assert.deepStrictEqual(tasksDict[Object.keys(tasksDict)[0]], result);
    });

    await t.test('It must throw an error if incorrect filePath is given', async (t) => {
        assert.rejects(async () => {
            await parseFile('/wrongPath')
        }, Error);
    });

    await t.test('parse a very big file', async () => {
        const bigFilePath = path.join(_dirname,'/fixtures/big_task_list.md');
        generateTaskListToFile(bigFilePath, 1000, 10)
            .then(() => {
                console.log('Task list generation complete.');
            })
            .catch((err) => {
                console.error('Failed to generate task list:', err);
            });
        console.time('parse');
        const bigTaskDict = await parseFile(path.join(_dirname, 'fixtures/big_task_list.md'));
        console.timeEnd('parse');
        assert.equal(typeof bigTaskDict, 'object');
        //clean up
        await deleteFile(bigFilePath);
    });
});