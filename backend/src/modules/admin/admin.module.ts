import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma.service';
import { CollegeCoinsModule } from '../college-coins/college-coins.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CollegeCoinsModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}

