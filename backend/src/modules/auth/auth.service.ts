import { Injectable, UnauthorizedException, BadRequestException, ConflictException, Inject, forwardRef, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { OtpService } from './otp.service';
import { LearnerService } from '../learner/learner.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
    @Inject(forwardRef(() => LearnerService))
    private learnerService: LearnerService,
  ) {}

  /**
   * Register new user (2-step process)
   */
  async register(registerDto: RegisterDto) {
    const { phone, phoneCountry, password, otpEmail, otpPhone, country } = registerDto;
    // Normalize email to lowercase for case-insensitive matching
    const email = registerDto.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await this.prisma.client.user.findFirst({
      where: {
        OR: [
          { email },
          { phone, phoneCountry },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or phone number already registered');
    }

    // Step 1: No OTPs provided - send OTPs
    if (!otpEmail || !otpPhone) {
      await Promise.all([
        this.otpService.sendEmailOtp(email, 'REGISTER'),
        this.otpService.sendPhoneOtp(phoneCountry, phone, 'REGISTER'),
      ]);

      return {
        message: 'Verification codes sent to your email and phone',
      };
    }

    // Step 2: OTPs provided - verify and create account
    const [emailValid, phoneValid] = await Promise.all([
      this.otpService.verifyEmailOtp(email, otpEmail, 'REGISTER'),
      this.otpService.verifyPhoneOtp(phoneCountry, phone, otpPhone, 'REGISTER'),
    ]);

    if (!emailValid) {
      throw new BadRequestException('Invalid or expired email verification code');
    }

    if (!phoneValid) {
      throw new BadRequestException('Invalid or expired phone verification code');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.client.user.create({
      data: {
        email,
        phone,
        phoneCountry,
        passwordHash,
        country,
        emailVerified: true,
        phoneVerified: true,
        role: 'USER',
      },
    });

    // Initialize learner account with $10,000 virtual balance
    try {
      await this.learnerService.initializeLearnerAccount(user.id);
      this.logger.log(`Initialized learner account for new user ${user.id}`);
    } catch (error) {
      this.logger.error(`Failed to initialize learner account for user ${user.id}`, error);
      // Don't fail registration if learner account initialization fails
      // It will be created on first learner mode access
    }

    return {
      message: 'Account created successfully. Please login.',
    };
  }

  /**
   * Login user with email and password
   */
  async login(loginDto: LoginDto) {
    const { password } = loginDto;
    // Normalize email to lowercase for case-insensitive matching
    const email = loginDto.email.toLowerCase().trim();

    // Find user
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    // Return user info (excluding sensitive data)
    return {
      message: 'Login successful',
      otp: '', // For compatibility with frontend
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        phoneCountry: user.phoneCountry,
        country: user.country,
        kycStatus: user.kycStatus,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
    };
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        phoneCountry: true,
        country: true,
        kycStatus: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        kyc: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Flatten kyc name fields into user object for convenience
    return {
      ...user,
      firstName: user.kyc?.firstName || null,
      lastName: user.kyc?.lastName || null,
      kyc: undefined, // Remove nested kyc object
    };
  }

  /**
   * Step 1: Request password reset - sends OTP to email
   */
  async forgotPassword(rawEmail: string) {
    const email = rawEmail.toLowerCase().trim();
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return {
        message: 'If an account exists with this email, a verification code has been sent.',
        nextStep: 'VERIFY',
        token: '',
      };
    }

    // Send OTP to email
    await this.otpService.sendEmailOtp(email, 'RESET');

    // Generate session token for this reset flow
    const token = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'password-reset-session' },
      { expiresIn: '1h' },
    );

    return {
      message: 'Verification code sent to your email.',
      nextStep: 'VERIFY',
      token,
    };
  }

  /**
   * Step 2: Verify OTP code
   */
  async verifyResetOtp(otp: string, token: string) {
    try {
      // Verify session token
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'password-reset-session') {
        throw new BadRequestException('Invalid session token');
      }

      // Verify OTP
      const isValid = await this.otpService.verifyEmailOtp(payload.email, otp, 'RESET');

      if (!isValid) {
        throw new BadRequestException('Invalid or expired verification code');
      }

      return {
        message: 'Verification successful. Please enter your new password.',
        nextStep: 'NEW_PASSWORD',
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification code');
    }
  }

  /**
   * Step 3: Set new password
   */
  async setNewPassword(password: string, token: string) {
    try {
      // Verify session token
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'password-reset-session') {
        throw new BadRequestException('Invalid session token');
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 10);

      // Update password
      await this.prisma.client.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });

      return {
        message: 'Password changed successfully.',
        nextStep: 'FINISH',
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired session');
    }
  }
}
