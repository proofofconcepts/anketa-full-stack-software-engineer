import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthController } from './health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { PollsModule } from './modules/polls/polls.module';
import { VotesModule } from './modules/votes/votes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().uri({ scheme: ['postgresql'] }).required(),
        JWT_ACCESS_SECRET: Joi.string().min(16).required(),
        JWT_REFRESH_SECRET: Joi.string().min(16).required(),
        JWT_ACCESS_TTL: Joi.string().required(),
        JWT_REFRESH_TTL: Joi.string().required(),
      }),
    }),
    PrismaModule,
    AuthModule,
    PollsModule,
    VotesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
