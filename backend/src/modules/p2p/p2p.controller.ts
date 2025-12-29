import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../admin/admin.guard';
import { KycVerifiedGuard } from './kyc.guard';
import { P2PService } from './p2p.service';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from './dto/payment-method.dto';
import { CreateAdDto, UpdateAdDto, ListAdsQueryDto } from './dto/ad.dto';
import {
  CreateTradeDto,
  UploadProofDto,
  MarkPaidDto,
  CancelTradeDto,
  ReleaseTradeDto,
  ListTradesQueryDto,
} from './dto/trade.dto';
import { OpenDisputeDto, ResolveDisputeDto } from './dto/dispute.dto';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('p2p')
export class P2PController {
  constructor(private p2pService: P2PService) {}

  // ============================================
  // PAYMENT METHODS
  // ============================================

  @Post('payment-methods')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async createPaymentMethod(
    @Request() req: AuthRequest,
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.p2pService.createPaymentMethod(req.user.id, dto);
  }

  @Get('payment-methods')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async getPaymentMethods(@Request() req: AuthRequest) {
    return this.p2pService.getUserPaymentMethods(req.user.id);
  }

  @Put('payment-methods/:id')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async updatePaymentMethod(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdatePaymentMethodDto,
  ) {
    return this.p2pService.updatePaymentMethod(req.user.id, id, dto);
  }

  @Delete('payment-methods/:id')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async deletePaymentMethod(
    @Request() req: AuthRequest,
    @Param('id') id: string,
  ) {
    return this.p2pService.deletePaymentMethod(req.user.id, id);
  }

  // ============================================
  // ADS
  // ============================================

  @Post('ads')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async createAd(@Request() req: AuthRequest, @Body() dto: CreateAdDto) {
    return this.p2pService.createAd(req.user.id, dto);
  }

  @Get('ads')
  async listAds(@Query() query: ListAdsQueryDto) {
    return this.p2pService.listAds(query);
  }

  @Get('ads/my')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async getMyAds(
    @Request() req: AuthRequest,
    @Query('includeAll') includeAll?: string,
  ) {
    return this.p2pService.getUserAds(req.user.id, includeAll === 'true');
  }

  @Get('ads/:id')
  async getAd(@Param('id') id: string) {
    return this.p2pService.getAd(id);
  }

  @Put('ads/:id')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async updateAd(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateAdDto,
  ) {
    return this.p2pService.updateAd(req.user.id, id, dto);
  }

  @Post('ads/:id/pause')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async pauseAd(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.p2pService.pauseAd(req.user.id, id);
  }

  @Post('ads/:id/resume')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async resumeAd(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.p2pService.resumeAd(req.user.id, id);
  }

  @Post('ads/:id/close')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async closeAd(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.p2pService.closeAd(req.user.id, id);
  }

  // ============================================
  // TRADES
  // ============================================

  @Post('trades')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async createTrade(@Request() req: AuthRequest, @Body() dto: CreateTradeDto) {
    return this.p2pService.createTrade(req.user.id, dto);
  }

  @Get('trades')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async listTrades(
    @Request() req: AuthRequest,
    @Query() query: ListTradesQueryDto,
  ) {
    return this.p2pService.listTrades(req.user.id, query);
  }

  @Get('trades/:id')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async getTrade(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.p2pService.getTrade(req.user.id, id);
  }

  @Post('trades/:id/proof')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async uploadProof(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UploadProofDto,
  ) {
    return this.p2pService.uploadProof(req.user.id, id, dto);
  }

  @Post('trades/:id/mark-paid')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async markPaid(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: MarkPaidDto,
  ) {
    return this.p2pService.markPaid(req.user.id, id, dto.idempotencyKey);
  }

  @Post('trades/:id/cancel')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async cancelTrade(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: CancelTradeDto,
  ) {
    return this.p2pService.cancelTrade(req.user.id, id, dto.idempotencyKey);
  }

  @Post('trades/:id/release')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async releaseTrade(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: ReleaseTradeDto,
  ) {
    return this.p2pService.releaseTrade(req.user.id, id, dto.idempotencyKey);
  }

  // ============================================
  // DISPUTES
  // ============================================

  @Post('trades/:id/dispute')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async openDispute(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: OpenDisputeDto,
  ) {
    return this.p2pService.openDispute(req.user.id, id, dto);
  }

  @Post('trades/:id/dispute/resolve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async resolveDispute(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.p2pService.resolveDispute(req.user.id, id, dto);
  }

  // ============================================
  // USER STATS
  // ============================================

  @Get('stats')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  async getUserStats(@Request() req: AuthRequest) {
    return this.p2pService.getUserStats(req.user.id);
  }

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  @Post('admin/expire-trades')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async expireUnpaidTrades() {
    return this.p2pService.expireUnpaidTrades();
  }
}

