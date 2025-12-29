import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

/**
 * Guard that ensures the user has completed KYC verification.
 * Only KYC-approved users can access P2P functionality.
 */
@Injectable()
export class KycVerifiedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('Authentication required');
    }

    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.kycStatus !== 'APPROVED') {
      throw new ForbiddenException(
        'KYC verification required to access P2P features. Please complete your identity verification first.',
      );
    }

    return true;
  }
}

