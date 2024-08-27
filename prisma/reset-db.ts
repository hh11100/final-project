import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Path to the Prisma database file
const dbPath = path.join(__dirname, '../prisma/dev.db');
const seedPath = path.join(__dirname, '../prisma/seed.ts');

// Delete the existing SQLite database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted existing dev.db database.');
} else {
  console.log('No existing dev.db database found.');
}

// Run the Prisma migration to regenerate the schema
console.log('Running Prisma push...');
execSync('npx prisma db push', { stdio: 'inherit' });

// Run the seed script to populate the new database
console.log('Running seed script...');
execSync(`tsx ${seedPath}`, { stdio: 'inherit' });

console.log('Database reset and seeded successfully.');
