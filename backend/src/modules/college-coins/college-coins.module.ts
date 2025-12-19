import { Module } from '@nestjs/common';
import { CollegeCoinsService } from './college-coins.service';
import { CollegeCoinsController } from './college-coins.controller';
import { PrismaService } from '../../prisma.service';
import { CoinbaseModule } from '../coinbase/coinbase.module';

@Module({
  imports: [CoinbaseModule],
  controllers: [CollegeCoinsController],
  providers: [CollegeCoinsService, PrismaService],
  exports: [CollegeCoinsService],
})
export class CollegeCoinsModule {}

