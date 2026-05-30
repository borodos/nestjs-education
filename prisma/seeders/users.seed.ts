import { PrismaClient } from '../../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';
import { faker } from '@faker-js/faker';

type User = {
  login: string;
  password: string;
  profile: {
    age: number;
    description: string;
  };
};

const saltOrRounds = Number(process.env.SALT_OR_ROUNDS) || 10;

const fakerUser = (): User => ({
  login: faker.internet.username(),
  password: faker.internet.password(),
  profile: {
    age: randomInt(10, 50),
    description: faker.lorem.sentence(1000),
  },
});

export default async (prisma: PrismaClient, countModels: number) => {
  for (let i = 0; i < countModels; i++) {
    const user = fakerUser();
    const pass = await bcrypt.hash(user.password, saltOrRounds);

    await prisma.user.create({
      data: {
        login: user.login,
        password: pass,
        profile: {
          create: user.profile,
        },
      },
    });
  }
};
