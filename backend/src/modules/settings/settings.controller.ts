import { Controller, Get, Post, Put, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateNotificationPreferencesDto } from './dto/notification-preferences.dto';
import { AppMode } from '@prisma/client';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  /**
   * Get user settings including profile, KYC, and notification preferences
   */
  @Get()
  async getUserSettings(@Request() req) {
    return this.settingsService.getUserSettings(req.user.id);
  }

  /**
   * Request password change - sends OTP to email
   */
  @Post('password/request')
  async requestPasswordChange(@Request() req) {
    return this.settingsService.requestPasswordChange(req.user.id);
  }

  /**
   * Change password with OTP verification
   */
  @Post('password/change')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.settingsService.changePassword(req.user.id, dto.otp, dto.newPassword);
  }

  /**
   * Get notification preferences
   */
  @Get('notifications')
  async getNotificationPreferences(@Request() req) {
    return this.settingsService.getNotificationPreferences(req.user.id);
  }

  /**
   * Update notification preferences
   */
  @Put('notifications')
  async updateNotificationPreferences(
    @Request() req,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.settingsService.updateNotificationPreferences(req.user.id, dto);
  }

  /**
   * Update app mode (LEARNER or INVESTOR)
   */
  @Put('app-mode')
  async updateAppMode(
    @Request() req,
    @Body() body: { mode: string },
  ) {
    const { mode } = body;
    
    if (!mode || !['LEARNER', 'INVESTOR'].includes(mode.toUpperCase())) {
      throw new BadRequestException('mode must be LEARNER or INVESTOR');
    }
    
    return this.settingsService.updateAppMode(req.user.id, mode.toUpperCase() as AppMode);
  }
}

