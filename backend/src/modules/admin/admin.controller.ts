import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import {
  CollegeCoinsService,
  CreateDemoCollegeCoinDto,
  UpdateDemoCollegeCoinDto,
} from '../college-coins/college-coins.service';
import { UserRole } from '@prisma/client';

// Configure multer storage for college coin icons
const iconUploadPath = join(process.cwd(), '..', 'frontend', 'public', 'images', 'college-coins');

// Ensure directory exists
if (!existsSync(iconUploadPath)) {
  mkdirSync(iconUploadPath, { recursive: true });
}

const iconStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, iconUploadPath);
  },
  filename: (req, file, cb) => {
    // Generate filename: ticker-timestamp.ext
    const ticker = req.body.ticker || 'icon';
    const uniqueSuffix = Date.now();
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${ticker.toLowerCase()}-${uniqueSuffix}${ext}`);
  },
});

const imageFileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Invalid file type. Only PNG, JPEG, GIF, WebP, and SVG are allowed.'), false);
  }
};

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly collegeCoinsService: CollegeCoinsService,
  ) {}

  // ============================================
  // USER MANAGEMENT
  // ============================================

  /**
   * Get paginated list of users
   */
  @Get('users')
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    const result = await this.adminService.getUsers({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      role: role as UserRole | undefined,
    });

    return {
      success: true,
      ...result,
    };
  }

  /**
   * Get single user details
   */
  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.adminService.getUserById(id);
    return {
      success: true,
      user,
    };
  }

  /**
   * Update user role
   */
  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    if (!role || !['USER', 'ADMIN'].includes(role)) {
      throw new BadRequestException('Invalid role. Must be USER or ADMIN.');
    }

    const user = await this.adminService.updateUserRole(id, role);
    return {
      success: true,
      user,
      message: `User role updated to ${role}`,
    };
  }

  // ============================================
  // DEMO COLLEGE COINS MANAGEMENT
  // ============================================

  /**
   * Get list of reference tokens for pegging
   */
  @Get('college-coins/reference-tokens')
  getReferenceTokens() {
    return {
      success: true,
      tokens: this.collegeCoinsService.getReferenceTokens(),
    };
  }

  /**
   * Get all demo college coins (including inactive)
   */
  @Get('college-coins')
  async getCollegeCoins() {
    const coins = await this.collegeCoinsService.findAll(true);
    return {
      success: true,
      coins,
    };
  }

  /**
   * Get single demo college coin
   */
  @Get('college-coins/:id')
  async getCollegeCoin(@Param('id') id: string) {
    const coin = await this.collegeCoinsService.findById(id);
    return {
      success: true,
      coin,
    };
  }

  /**
   * Create a new demo college coin
   */
  @Post('college-coins')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: iconStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    }),
  )
  async createCollegeCoin(
    @Body() body: any,
    @UploadedFile() icon?: Express.Multer.File,
  ) {
    // Parse categories if it's a string
    let categories: string[] = [];
    if (body.categories) {
      if (typeof body.categories === 'string') {
        try {
          categories = JSON.parse(body.categories);
        } catch {
          categories = body.categories.split(',').map((c: string) => c.trim());
        }
      } else if (Array.isArray(body.categories)) {
        categories = body.categories;
      }
    }

    const dto: CreateDemoCollegeCoinDto = {
      ticker: body.ticker,
      name: body.name,
      iconUrl: icon ? `/images/college-coins/${icon.filename}` : body.iconUrl,
      peggedToAsset: body.peggedToAsset,
      peggedPercentage: parseFloat(body.peggedPercentage),
      isActive: body.isActive === 'true' || body.isActive === true,
      description: body.description,
      website: body.website,
      whitepaper: body.whitepaper,
      twitter: body.twitter,
      discord: body.discord,
      categories,
      genesisDate: body.genesisDate ? new Date(body.genesisDate) : undefined,
    };

    const coin = await this.collegeCoinsService.create(dto);
    return {
      success: true,
      coin,
      message: `Demo college coin ${coin.ticker} created successfully`,
    };
  }

  /**
   * Update a demo college coin
   */
  @Patch('college-coins/:id')
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: iconStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    }),
  )
  async updateCollegeCoin(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() icon?: Express.Multer.File,
  ) {
    // Parse categories if it's a string
    let categories: string[] | undefined;
    if (body.categories !== undefined) {
      if (typeof body.categories === 'string') {
        try {
          categories = JSON.parse(body.categories);
        } catch {
          categories = body.categories.split(',').map((c: string) => c.trim());
        }
      } else if (Array.isArray(body.categories)) {
        categories = body.categories;
      }
    }

    const dto: UpdateDemoCollegeCoinDto = {
      ...(body.ticker && { ticker: body.ticker }),
      ...(body.name && { name: body.name }),
      ...(icon && { iconUrl: `/images/college-coins/${icon.filename}` }),
      ...(body.iconUrl && !icon && { iconUrl: body.iconUrl }),
      ...(body.peggedToAsset && { peggedToAsset: body.peggedToAsset }),
      ...(body.peggedPercentage !== undefined && {
        peggedPercentage: parseFloat(body.peggedPercentage),
      }),
      ...(body.isActive !== undefined && {
        isActive: body.isActive === 'true' || body.isActive === true,
      }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.website !== undefined && { website: body.website }),
      ...(body.whitepaper !== undefined && { whitepaper: body.whitepaper }),
      ...(body.twitter !== undefined && { twitter: body.twitter }),
      ...(body.discord !== undefined && { discord: body.discord }),
      ...(categories !== undefined && { categories }),
      ...(body.genesisDate !== undefined && {
        genesisDate: body.genesisDate ? new Date(body.genesisDate) : null,
      }),
    };

    const coin = await this.collegeCoinsService.update(id, dto);
    return {
      success: true,
      coin,
      message: `Demo college coin ${coin.ticker} updated successfully`,
    };
  }

  /**
   * Delete a demo college coin
   */
  @Delete('college-coins/:id')
  async deleteCollegeCoin(@Param('id') id: string) {
    await this.collegeCoinsService.delete(id);
    return {
      success: true,
      message: 'Demo college coin deleted successfully',
    };
  }
}

