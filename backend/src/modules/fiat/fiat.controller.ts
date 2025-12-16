import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FiatService } from './fiat.service';
import Stripe from 'stripe';

@Controller('fiat')
export class FiatController {
  constructor(private readonly fiatService: FiatService) {}

  /**
   * POST /api/fiat/deposit
   * Create a deposit payment intent
   */
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  async createDeposit(@Request() req: any, @Body() body: { amount: number }) {
    const { amount } = body;

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    return this.fiatService.createDepositIntent(req.user.id, amount);
  }

  /**
   * POST /api/fiat/webhook
   * Handle Stripe webhook events
   * Note: This endpoint should be configured in NestJS to accept raw body
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Request() req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      console.error('[Stripe Webhook] Missing stripe-signature header');
      throw new Error('Missing stripe-signature header');
    }

    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    let event: Stripe.Event;

    try {
      const rawBody = req.rawBody as Buffer;
      if (!rawBody) {
        console.error('[Stripe Webhook] Missing raw body');
        throw new Error('Missing raw body');
      }

      event = this.fiatService.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
      
      console.log(`[Stripe Webhook] Received event: ${event.type} (id: ${event.id})`);
    } catch (err: any) {
      console.error(`[Stripe Webhook] Signature verification failed:`, err.message);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    try {
      await this.fiatService.handleWebhook(event);
      console.log(`[Stripe Webhook] Successfully processed event: ${event.type}`);
    } catch (error: any) {
      console.error(`[Stripe Webhook] Error processing event ${event.type}:`, error);
      throw error;
    }

    return { received: true };
  }

  /**
   * GET /api/fiat/transactions
   * Get user's fiat transactions
   */
  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async getTransactions(
    @Request() req: any,
    @Body() body?: { type?: 'DEPOSIT' | 'WITHDRAWAL'; limit?: number; offset?: number },
  ) {
    return this.fiatService.getUserTransactions(req.user.id, body);
  }

  /**
   * POST /api/fiat/sync-payment
   * Sync payment status from Stripe (fallback if webhook didn't process)
   */
  @UseGuards(JwtAuthGuard)
  @Post('sync-payment')
  @HttpCode(HttpStatus.OK)
  async syncPayment(@Request() req: any, @Body() body: { transactionId: string }) {
    const { transactionId } = body;
    await this.fiatService.syncPaymentStatus(req.user.id, transactionId);
    return { success: true };
  }

  /**
   * GET /api/fiat/bank-accounts
   * Get user's bank accounts
   */
  @UseGuards(JwtAuthGuard)
  @Get('bank-accounts')
  async getBankAccounts(@Request() req: any) {
    return this.fiatService.getUserBankAccounts(req.user.id);
  }

  /**
   * POST /api/fiat/bank-accounts
   * Add a new bank account
   */
  @UseGuards(JwtAuthGuard)
  @Post('bank-accounts')
  @HttpCode(HttpStatus.CREATED)
  async addBankAccount(
    @Request() req: any,
    @Body() body: { paymentMethodId: string; accountName: string },
  ) {
    const { paymentMethodId, accountName } = body;
    if (!paymentMethodId || !accountName) {
      throw new Error('paymentMethodId and accountName are required');
    }
    return this.fiatService.addBankAccount(req.user.id, paymentMethodId, accountName);
  }

  /**
   * DELETE /api/fiat/bank-accounts/:id
   * Delete a bank account
   */
  @UseGuards(JwtAuthGuard)
  @Delete('bank-accounts/:id')
  @HttpCode(HttpStatus.OK)
  async deleteBankAccount(@Request() req: any, @Param('id') id: string) {
    await this.fiatService.deleteBankAccount(req.user.id, id);
    return { success: true };
  }

  /**
   * POST /api/fiat/withdraw
   * Create a withdrawal (Stripe payout)
   */
  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  async createWithdrawal(
    @Request() req: any,
    @Body() body: { bankAccountId: string; amount: number },
  ) {
    const { bankAccountId, amount } = body;
    if (!bankAccountId || !amount || amount <= 0) {
      throw new Error('bankAccountId and valid amount are required');
    }
    return this.fiatService.createWithdrawal(req.user.id, bankAccountId, amount);
  }
}

