import { PrismaClient } from './generated/client';
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create 5 users with hashed passwords
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Graf',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Vollenweider',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie@example.com',
        firstName: 'Charlie',
        lastName: 'Cooper',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana@example.com',
        firstName: 'Diana',
        lastName: 'Schock',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'edward@example.com',
        firstName: 'Edward',
        lastName: 'Looser',
        password: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        name: 'Office',
        description: 'Büro im Erdgeschoss',
        capacity: 2,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Bedroom',
        description: 'Ehem. Zimmer von Claudi',
        capacity: 2,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Tessin',
        description: 'Haus im Tessin',
        capacity: 6,
      },
    }),
  ]);

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
