import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { VeriffService } from './veriff.service';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [KycController],
  providers: [KycService, VeriffService, PrismaService],
  exports: [KycService],
})
export class KycModule {}

