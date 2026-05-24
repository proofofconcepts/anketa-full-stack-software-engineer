import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'demo@anketa.local' },
  });

  if (existing) {
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: 'demo@anketa.local',
      displayName: 'Demo User',
      passwordHash: await hash('demo-password', 10),
    },
  });

  await prisma.poll.create({
    data: {
      question: 'Which topic should be featured next?',
      createdById: user.id,
      options: {
        create: [{ label: 'Tech' }, { label: 'Culture' }, { label: 'Environment' }],
      },
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
