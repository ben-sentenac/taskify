import * as fs from 'fs';
import { unlink } from 'fs/promises';
import { Readable } from 'stream';

// TypeScript: Typage des paramètres pour plus de clarté
function* taskGenerator(numSections: number, numTasksPerSection: number): Generator<string> {
  const taskStatus = ['[x]', '[-]', '[/]'] as const;

  for (let i = 1; i <= numSections; i++) {
    yield `# Task: Task Section ${i}\n`;

    for (let j = 1; j <= numTasksPerSection; j++) {
      const status = taskStatus[Math.floor(Math.random() * taskStatus.length)];
      yield `- ${status} Task ${j} description\n`;
    }

    yield `\n`; // Séparation entre les sections
  }
}

// Fonction pour écrire la liste des tâches dans un fichier en utilisant des streams
export async function generateTaskListToFile(
  filePath: string, 
  numSections: number, 
  numTasksPerSection: number
): Promise<void> {
  const taskStream = Readable.from(taskGenerator(numSections, numTasksPerSection));
  const writeStream = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    taskStream.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`Task list successfully written to ${filePath}`);
      resolve();
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to file:', err);
      reject(err);
    });
  });
}

/*Utilisation de la fonction pour générer une énorme liste de tâches
generateTaskListToFile('big_task_list.md', 1000, 10)
  .then(() => {
    console.log('Task list generation complete.');
  })
  .catch((err) => {
    console.error('Failed to generate task list:', err);
  });
  */

  export async function deleteFile(filePath:string) {
    try {
      await unlink(filePath)
    } catch (error) {
      throw error;
    }
  }

  