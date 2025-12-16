import { Module } from '@nestjs/common';
import { LearnerController } from './learner.controller';
import { LearnerService } from './learner.service';
import { PrismaService } from '../../prisma.service';
import { CoinbaseModule } from '../coinbase/coinbase.module';

@Module({
  imports: [CoinbaseModule],
  controllers: [LearnerController],
  providers: [LearnerService, PrismaService],
  exports: [LearnerService],
})
export class LearnerModule {}


