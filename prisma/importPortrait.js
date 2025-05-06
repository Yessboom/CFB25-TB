import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function importPortrait() {
    // Path to JSon file
    const dataPortraitPath = path.join("public/mappings", `portraitID_mapping.json`); 
    
    try {
        // Read and parse the JSON file
        const data = await fs.readFile(dataPortraitPath, 'utf8');
        const jsonData = JSON.parse(data);

        // Prepare the data for insertion into the database
        const portraits = Object.values(jsonData).map((item) => ({
            genericid: item.portraitId.toString(),
            recipe: item.recipe,
            complexionId: item.complexionId.toString(),
            imagelink: item.image,
            thumbnaillink: item.thumbnail
        }));

        // Insert the data into  database
        for (const portrait of portraits) {
            await prisma.portrait.create({
                data: portrait
            });
        }

        console.log('Portrait data successfully imported!');
    } catch (error) {
        console.error('Error importing portrait data:', error);
    } finally {
        // Disconnect Prisma client after
        await prisma.$disconnect();
    }
}

importPortrait();
