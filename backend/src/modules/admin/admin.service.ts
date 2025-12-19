import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserRole } from '@prisma/client';

export interface UserListItem {
  id: string;
  email: string;
  phone: string;
  phoneCountry: string;
  country: string;
  role: UserRole;
  appMode: string;
  kycStatus: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // KYC info
  firstName: string | null;
  lastName: string | null;
}

export interface UserDetails extends UserListItem {
  kyc: {
    id: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    dateOfBirth: Date | null;
    street1: string | null;
    street2: string | null;
    city: string | null;
    region: string | null;
    postalCode: string | null;
    country: string | null;
    currentStep: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get paginated list of users
   */
  async getUsers(options?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
  }): Promise<{ users: UserListItem[]; total: number; page: number; limit: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options?.search) {
      where.OR = [
        { email: { contains: options.search, mode: 'insensitive' } },
        { phone: { contains: options.search } },
        { kyc: { firstName: { contains: options.search, mode: 'insensitive' } } },
        { kyc: { lastName: { contains: options.search, mode: 'insensitive' } } },
      ];
    }

    if (options?.role) {
      where.role = options.role;
    }

    const [users, total] = await Promise.all([
      this.prisma.client.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          kyc: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.client.user.count({ where }),
    ]);

    return {
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        phoneCountry: user.phoneCountry,
        country: user.country,
        role: user.role,
        appMode: user.appMode,
        kycStatus: user.kycStatus,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        firstName: user.kyc?.firstName || null,
        lastName: user.kyc?.lastName || null,
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * Get single user details
   */
  async getUserById(id: string): Promise<UserDetails> {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
      include: {
        kyc: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      phoneCountry: user.phoneCountry,
      country: user.country,
      role: user.role,
      appMode: user.appMode,
      kycStatus: user.kycStatus,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.kyc?.firstName || null,
      lastName: user.kyc?.lastName || null,
      kyc: user.kyc
        ? {
            id: user.kyc.id,
            firstName: user.kyc.firstName,
            middleName: user.kyc.middleName,
            lastName: user.kyc.lastName,
            dateOfBirth: user.kyc.dateOfBirth,
            street1: user.kyc.street1,
            street2: user.kyc.street2,
            city: user.kyc.city,
            region: user.kyc.region,
            postalCode: user.kyc.postalCode,
            country: user.kyc.country,
            currentStep: user.kyc.currentStep,
            status: user.kyc.status,
            createdAt: user.kyc.createdAt,
            updatedAt: user.kyc.updatedAt,
          }
        : null,
    };
  }

  /**
   * Update user role
   */
  async updateUserRole(id: string, role: UserRole): Promise<UserListItem> {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.client.user.update({
      where: { id },
      data: { role },
      include: {
        kyc: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    this.logger.log(`Updated user ${id} role to ${role}`);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      phone: updatedUser.phone,
      phoneCountry: updatedUser.phoneCountry,
      country: updatedUser.country,
      role: updatedUser.role,
      appMode: updatedUser.appMode,
      kycStatus: updatedUser.kycStatus,
      emailVerified: updatedUser.emailVerified,
      phoneVerified: updatedUser.phoneVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      firstName: updatedUser.kyc?.firstName || null,
      lastName: updatedUser.kyc?.lastName || null,
    };
  }
}

