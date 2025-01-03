import test from 'node:test';
import assert from 'node:assert';
import { Watcher } from '../../lib/Watcher.js';
import EventEmitter from 'node:events';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTaskFromFile } from '../../lib/taskParser.js';
import { writeFile, unlink } from 'node:fs/promises';


const _DIRNAME_ = dirname(fileURLToPath(import.meta.url));

async function createFileContent(content: string) {
    try {
        const tempFilePath = resolve(_DIRNAME_, 'fixtures/my-file.txt');
        await writeFile(tempFilePath, 'Initial content');
        return tempFilePath;
    } catch (error) {
        throw error;
    }
}
async function cleanUp(path: string) {
    try {
        await unlink(path)
    } catch (error) {
        throw error;
    }
}
test('Watcher class Test', async (t) => {
    const file = resolve(_DIRNAME_, 'fixtures/task-test.md');
    console.log(file);
    const watcher = new Watcher(file);
    await t.test('it should extends EventEmitter', async (t) => {
        assert.ok(watcher instanceof EventEmitter);
    });
    await t.test('Watcher.init: Must instanciate correctly', async (t) => {
        await watcher.init();
        parseTaskFromFile({ file });
        assert.ok(watcher.getStatistics().printCount === 1);
    });
    await t.test('Watcher.hashFileContent', async (t) => {
        const tempFilePath = await createFileContent('My first content');
        const watcher = new Watcher(tempFilePath);
        await watcher.init();
        const hashedContent = await watcher.hashFileContent();
        await t.test('hashFileContent should return string', async () => {
            assert.ok(typeof hashedContent === 'string');
        });
        await t.test('Hash should not change if same content', async () => {
            assert.ok(hashedContent === await watcher.hashFileContent(tempFilePath));
        });
        await t.test('Hash should change if not same content', async () => {
            await writeFile(tempFilePath, ' add content');
            assert.ok(hashedContent !== await watcher.hashFileContent());
        });
    });
    await t.test('Watcher.watch should emit print event on file change', async (t) => {

        const tempFilePath = await createFileContent('Initial-Content');

        const fileWatcher = new Watcher(tempFilePath);
        // Spy on the `emit` method
        let emittedEvent: string | Symbol | null = null;

        fileWatcher.emit = (event, data) => {    
            emittedEvent = event;
            return emittedEvent !== undefined;
        };

        // Start watching the file in the background
        fileWatcher.watch();

        // Simulate file change after a slight delay
        await new Promise((resolve) => {
            setTimeout(resolve, 100)
        });  // Wait briefly before modifying the file
        await writeFile(tempFilePath, 'Updated content');

        // Wait for the watcher to process the file change
        await new Promise((resolve) => {
            setTimeout(resolve, 100)
        }
        );
        // Assert that emit was called with the correct arguments
        assert.strictEqual(emittedEvent, 'update', 'Expected event should be emitted');
        //console.log(taskArray);
        await fileWatcher.stopWatching();
        // Clean up: Remove the temporary file after the test
        await cleanUp(tempFilePath);
    })

});
