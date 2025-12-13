import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { EmailService } from './email.service';
import { TestController } from './test.controller';
import { AuthModule } from './modules/auth/auth.module';
import { KycModule } from './modules/kyc/kyc.module';
import { CoinbaseModule } from './modules/coinbase/coinbase.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '900'), // 15 minutes
      limit: parseInt(process.env.RATE_LIMIT_MAX || '5'),
    }]),
    // Auth module
    AuthModule,
    // KYC / Onboarding module
    KycModule,
    // Coinbase trading module
    CoinbaseModule,
    // Internal orders module
    OrdersModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService, PrismaService, EmailService],
})
export class AppModule {}
