import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma.service';
import { CoinbaseModule } from '../coinbase/coinbase.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [CoinbaseModule, AssetsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}

