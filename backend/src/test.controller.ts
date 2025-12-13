import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('test')
export class TestController {
  constructor(private readonly emailService: EmailService) {}

  @Get('email')
  async testEmail(@Query('to') to: string) {
    if (!to) {
      return { error: 'Please provide ?to=email@example.com' };
    }

    try {
      await this.emailService.sendOTP(to, '123456', 'email');
      return {
        success: true,
        message: `Test OTP email sent to ${to}`,
      };
    } catch (error) {
      console.error('Email test error:', error);
      return {
        success: false,
        error: error?.message || 'Unknown error',
        stack: error?.stack,
        raw: JSON.stringify(error, null, 2),
      };
    }
  }
}
