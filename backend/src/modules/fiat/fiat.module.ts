import { Module } from '@nestjs/common';
import { FiatController } from './fiat.controller';
import { FiatService } from './fiat.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [FiatController],
  providers: [FiatService, PrismaService],
  exports: [FiatService],
})
export class FiatModule {}

