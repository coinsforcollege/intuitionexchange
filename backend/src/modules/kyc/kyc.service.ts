import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { VeriffService } from './veriff.service';
import { PersonalDetailsDto } from './dto/personal-details.dto';
import { AddressDto } from './dto/address.dto';
import { KycStatus } from '@prisma/client';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private prisma: PrismaService,
    private veriffService: VeriffService,
  ) {}

  /**
   * Get or create KYC record for user
   */
  async getOrCreateKyc(userId: string) {
    let kyc = await this.prisma.client.kyc.findUnique({
      where: { userId },
    });

    if (!kyc) {
      kyc = await this.prisma.client.kyc.create({
        data: {
          userId,
          currentStep: 0,
        },
      });
    }

    return kyc;
  }

  /**
   * Get KYC status for user
   */
  async getKycStatus(userId: string) {
    const kyc = await this.getOrCreateKyc(userId);
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    });

    return {
      currentStep: kyc.currentStep,
      status: user?.kycStatus || 'PENDING',
      veriffStatus: kyc.veriffStatus,
      hasPersonalDetails: !!(kyc.firstName && kyc.lastName && kyc.dateOfBirth),
      hasAddress: !!(kyc.street1 && kyc.city && kyc.region && kyc.postalCode && kyc.country),
      hasVeriffSession: !!kyc.veriffSessionId,
    };
  }

  /**
   * Save personal details (Step 1)
   */
  async savePersonalDetails(userId: string, dto: PersonalDetailsDto) {
    const kyc = await this.getOrCreateKyc(userId);

    const updated = await this.prisma.client.kyc.update({
      where: { id: kyc.id },
      data: {
        firstName: dto.firstName,
        middleName: dto.middleName || null,
        lastName: dto.lastName,
        dateOfBirth: new Date(dto.dateOfBirth),
        currentStep: Math.max(kyc.currentStep, 1),
      },
    });

    return {
      message: 'Personal details saved',
      currentStep: updated.currentStep,
    };
  }

  /**
   * Save address (Step 2)
   */
  async saveAddress(userId: string, dto: AddressDto) {
    const kyc = await this.getOrCreateKyc(userId);

    // Ensure personal details are completed first
    if (!kyc.firstName || !kyc.lastName || !kyc.dateOfBirth) {
      throw new BadRequestException('Please complete personal details first');
    }

    const updated = await this.prisma.client.kyc.update({
      where: { id: kyc.id },
      data: {
        street1: dto.street1,
        street2: dto.street2 || null,
        city: dto.city,
        region: dto.region,
        postalCode: dto.postalCode,
        country: dto.country,
        currentStep: Math.max(kyc.currentStep, 2),
      },
    });

    return {
      message: 'Address saved',
      currentStep: updated.currentStep,
    };
  }

  /**
   * Create Veriff session (Step 3)
   */
  async createVeriffSession(userId: string) {
    const kyc = await this.getOrCreateKyc(userId);

    // Ensure previous steps are completed
    if (!kyc.firstName || !kyc.lastName || !kyc.dateOfBirth) {
      throw new BadRequestException('Please complete personal details first');
    }
    if (!kyc.street1 || !kyc.city || !kyc.region || !kyc.postalCode || !kyc.country) {
      throw new BadRequestException('Please complete address details first');
    }

    // Format date of birth for Veriff (YYYY-MM-DD)
    const dob = kyc.dateOfBirth ? kyc.dateOfBirth.toISOString().split('T')[0] : '';

    // Create new Veriff session
    const session = await this.veriffService.createSession(
      userId,
      kyc.firstName,
      kyc.lastName,
      dob,
    );

    // Save session details
    await this.prisma.client.kyc.update({
      where: { id: kyc.id },
      data: {
        veriffSessionId: session.verification.id,
        veriffStatus: 'created',
        currentStep: 3,
      },
    });

    // Update user status to SUBMITTED
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { kycStatus: 'SUBMITTED' },
    });

    return {
      sessionId: session.verification.id,
      sessionUrl: session.verification.url,
      sessionToken: session.verification.sessionToken,
    };
  }

  /**
   * Handle Veriff webhook
   */
  async handleVeriffWebhook(payload: unknown, signature: string, rawBody: string) {
    // Verify signature
    if (!this.veriffService.verifyWebhookSignature(rawBody, signature)) {
      this.logger.warn('Invalid Veriff webhook signature');
      throw new BadRequestException('Invalid signature');
    }

    const webhookData = this.veriffService.parseWebhookPayload(payload);
    const { id: sessionId, attemptId, status, code, reason, reasonCode, vendorData: userId } = webhookData;

    this.logger.log(`Veriff webhook received: session=${sessionId}, status=${status}, code=${code}`);

    // Find KYC by session ID
    const kyc = await this.prisma.client.kyc.findUnique({
      where: { veriffSessionId: sessionId },
    });

    if (!kyc) {
      this.logger.warn(`KYC not found for Veriff session: ${sessionId}`);
      return { received: true };
    }

    // Map Veriff status to our status
    const kycStatus = this.veriffService.mapVeriffStatusToKycStatus(status, code);

    // Update KYC record
    await this.prisma.client.kyc.update({
      where: { id: kyc.id },
      data: {
        veriffAttemptId: attemptId,
        veriffStatus: status,
        veriffReason: reason || reasonCode || null,
        veriffDecisionTime: webhookData.decisionTime ? new Date(webhookData.decisionTime) : null,
        status: kycStatus,
        currentStep: kycStatus === 'APPROVED' ? 4 : kyc.currentStep,
      },
    });

    // Update user KYC status
    await this.prisma.client.user.update({
      where: { id: kyc.userId },
      data: { kycStatus },
    });

    this.logger.log(`KYC updated for user ${kyc.userId}: status=${kycStatus}`);

    return { received: true };
  }

  /**
   * Manually check Veriff decision (polling fallback)
   */
  async checkVeriffDecision(userId: string) {
    const kyc = await this.prisma.client.kyc.findUnique({
      where: { userId },
    });

    if (!kyc || !kyc.veriffSessionId) {
      throw new NotFoundException('No active verification session');
    }

    const decision = await this.veriffService.getDecision(kyc.veriffSessionId);

    if (!decision) {
      return {
        status: kyc.status || 'PENDING',
        veriffStatus: kyc.veriffStatus || null,
        reason: null,
      };
    }

    // Update if decision is available
    const kycStatus = this.veriffService.mapVeriffStatusToKycStatus(decision.status, decision.code);

    if (kycStatus !== kyc.status) {
      await this.prisma.client.kyc.update({
        where: { id: kyc.id },
        data: {
          veriffStatus: decision.status,
          veriffReason: decision.reason || decision.reasonCode || null,
          veriffDecisionTime: decision.decisionTime ? new Date(decision.decisionTime) : null,
          status: kycStatus,
          currentStep: kycStatus === 'APPROVED' ? 4 : kyc.currentStep,
        },
      });

      await this.prisma.client.user.update({
        where: { id: userId },
        data: { kycStatus },
      });
    }

    return {
      status: kycStatus,
      veriffStatus: decision.status,
      reason: decision.reason,
    };
  }

  /**
   * Get full KYC details (for admin or user profile)
   */
  async getKycDetails(userId: string) {
    const kyc = await this.prisma.client.kyc.findUnique({
      where: { userId },
    });

    if (!kyc) {
      return null;
    }

    return {
      id: kyc.id,
      currentStep: kyc.currentStep,
      status: kyc.status,
      personalDetails: {
        firstName: kyc.firstName,
        middleName: kyc.middleName,
        lastName: kyc.lastName,
        dateOfBirth: kyc.dateOfBirth,
      },
      address: {
        street1: kyc.street1,
        street2: kyc.street2,
        city: kyc.city,
        region: kyc.region,
        postalCode: kyc.postalCode,
        country: kyc.country,
      },
      verification: {
        sessionId: kyc.veriffSessionId,
        status: kyc.veriffStatus,
        reason: kyc.veriffReason,
        decisionTime: kyc.veriffDecisionTime,
      },
      createdAt: kyc.createdAt,
      updatedAt: kyc.updatedAt,
    };
  }
}

