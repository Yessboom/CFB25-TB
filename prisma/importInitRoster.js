import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function importInitRoster() {
  const characters = ['powerhouse', "air_it_out", "cupcakes", "ground_attack", "option", "spread" ]; 

  for (const name of characters) {
    const dataRosterPath = path.join("public/rosters", `${name}-roster.json`);
    const dataVisualPath = path.join("public/characterVisual", `${name}-visual.json`);

    try {
      const dataRoster = JSON.parse(await fs.readFile(dataRosterPath, 'utf-8'));
      const dataVisual = JSON.parse(await fs.readFile(dataVisualPath, 'utf-8'));

      await prisma.initRoster.create({
        data: {
          name,
          dataRoster,
          dataVisual,
        },
      });

      console.log(`Imported ${name}`);
    } catch (err) {
      console.error(`Failed to import ${name}:`, err);
    }
  }

  await prisma.$disconnect();
}

importInitRoster();
