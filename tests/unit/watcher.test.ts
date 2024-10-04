import test from 'node:test';
import assert from 'node:assert';
import { Watcher } from '../../lib/Watcher.js';
import EventEmitter from 'node:events';
import { SnapShot } from '../../lib/types/types.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFile } from '../../lib/taskParser.js';
import {writeFile } from 'node:fs/promises';
import { unlink } from 'node:fs';

const _DIRNAME_ = dirname(fileURLToPath(import.meta.url));
console.log(_DIRNAME_)
test('Watcher class Test', async (t) => {

    const file = resolve(_DIRNAME_, '..', '..', 'fixtures/task.md');
    console.log(file);
    const watcher = new Watcher(file);
    await t.test('it should extends EventEmitter', async (t) => {
        assert.ok(watcher instanceof EventEmitter);
    });

    await t.test('Watcher.compareSnapshots: must compare the current snapshot with a new one', async (t) => {
        const current: SnapShot = {
            "Setup Environment": {
                "percentage": 33,
                "subtasks": [
                    { "name": "Install required software (Node.js, Git)", "status": "Not Yet" },
                    { "name": "Set up project repository", "status": "In Progress" },
                    { "name": "Initialize the project with `npm init`", "status": "Done" }
                ]
            }
        };
        const newSnapshot: SnapShot = {
            "Setup Environment": {
                "percentage": 100,
                "subtasks": [
                    { "name": "Install required software (Node.js, Git)", "status": "Done" },
                    { "name": "Set up project repository", "status": "Done" },
                    { "name": "Initialize the project with `npm init`", "status": "Done" }
                ]
            }
        };
        watcher.setSnapshot(current);
        assert.ok(watcher.compareSnapshots(current) === true);
        assert.ok(watcher.compareSnapshots(newSnapshot) === false);
        watcher.setSnapshot(null);
        assert.ok(watcher.getSnapShot() === null);
    });

    await t.test('Watcher.init: Must instanciate correctly', async (t) => {
        await watcher.init();
        const content: SnapShot = await parseFile(file);
        const snapshot: SnapShot | null = watcher.getSnapShot()
        assert.deepStrictEqual(snapshot, content);
        assert.ok(watcher.shoulUpdate === false);
        assert.ok(watcher.getStatistics().printCount === 1);
    });

    await t.test('Watcher.watch should emit shoulUpdate event on file change', async (t) => {
        
        const tempFilePath = resolve(_DIRNAME_, 'fixtures/my-file.txt');

        await writeFile(tempFilePath, 'Initial content');
      
        const fileWatcher = new Watcher(tempFilePath);
      
        // Spy on the `emit` method
        let emittedEvent:string | Symbol | null = null;
        let emittedData = null;
        fileWatcher.emit = (event, data) => {
            console.log(event);
          emittedEvent = event;
          emittedData = data;
          return emittedEvent ? true:false; 
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
            setTimeout(resolve, 100)}
        );
      
        // Assert that emit was called with the correct arguments
        assert.strictEqual(emittedEvent, 'shouldUpdate', 'Expected event should be emitted');
        assert.deepStrictEqual(emittedData, { }, 'Expected data should match');

        await fileWatcher.stopWatching();
        // Clean up: Remove the temporary file after the test
        await new Promise((resolve, reject) => {
          unlink(tempFilePath, (err) => {
            if (err) reject(err);
            resolve(true);
          });
        });
    })

});