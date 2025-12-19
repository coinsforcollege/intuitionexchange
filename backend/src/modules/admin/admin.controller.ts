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
  UploadedFiles,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import {
  CollegeCoinsService,
  CreateDemoCollegeCoinDto,
  UpdateDemoCollegeCoinDto,
} from '../college-coins/college-coins.service';
import { UserRole } from '@prisma/client';
import * as csv from 'csv-parse/sync';

// All uploads go to backend/uploads folder (attach persistent disk here on Render)
const uploadsBasePath = join(process.cwd(), 'uploads');

// Configure multer storage for college coin icons
const iconUploadPath = join(uploadsBasePath, 'college-coins');

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

// Configure multer storage for media manager (any file type)
const mediaUploadPath = join(uploadsBasePath, 'media');

// Ensure media directory exists
if (!existsSync(mediaUploadPath)) {
  mkdirSync(mediaUploadPath, { recursive: true });
}

const mediaStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaUploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: original-name-timestamp.ext
    const originalName = basename(file.originalname, extname(file.originalname));
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const uniqueSuffix = Date.now();
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  },
});

// Export paths for use in file serving
export { uploadsBasePath, iconUploadPath, mediaUploadPath };

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
      iconUrl: icon ? `/api/uploads/college-coins/${icon.filename}` : body.iconUrl,
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
      ...(icon && { iconUrl: `/api/uploads/college-coins/${icon.filename}` }),
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

  /**
   * Import demo college coins from CSV
   * CSV columns: ticker,name,peggedToAsset,peggedPercentage,iconUrl,description,website,whitepaper,twitter,discord,categories,genesisDate,isActive
   */
  @Post('college-coins/import')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    }),
  )
  async importCollegeCoins(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV');
    }

    // Type for CSV record
    interface CsvRecord {
      ticker?: string;
      name?: string;
      peggedToAsset?: string;
      peggedPercentage?: string;
      iconUrl?: string;
      isActive?: string;
      description?: string;
      website?: string;
      whitepaper?: string;
      twitter?: string;
      discord?: string;
      categories?: string;
      genesisDate?: string;
    }

    try {
      const content = file.buffer.toString('utf-8');
      const records = csv.parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as CsvRecord[];

      const results = {
        total: records.length,
        created: 0,
        failed: 0,
        errors: [] as { row: number; ticker: string; error: string }[],
      };

      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        try {
          // Parse categories
          let categories: string[] = [];
          if (record.categories) {
            categories = record.categories.split('|').map((c: string) => c.trim()).filter(Boolean);
          }

          const dto: CreateDemoCollegeCoinDto = {
            ticker: record.ticker?.toUpperCase() || '',
            name: record.name || '',
            peggedToAsset: record.peggedToAsset?.toUpperCase() || '',
            peggedPercentage: parseFloat(record.peggedPercentage || '0') || 0,
            iconUrl: record.iconUrl || undefined,
            isActive: record.isActive !== 'false' && record.isActive !== '0',
            description: record.description || undefined,
            website: record.website || undefined,
            whitepaper: record.whitepaper || undefined,
            twitter: record.twitter || undefined,
            discord: record.discord || undefined,
            categories,
            genesisDate: record.genesisDate ? new Date(record.genesisDate) : undefined,
          };

          // Validate required fields
          if (!dto.ticker || !dto.name || !dto.peggedToAsset || !dto.peggedPercentage) {
            throw new Error('Missing required fields: ticker, name, peggedToAsset, peggedPercentage');
          }

          await this.collegeCoinsService.create(dto);
          results.created++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({
            row: i + 2, // +2 because row 1 is header, and we're 0-indexed
            ticker: record.ticker || 'unknown',
            error: error.message || 'Unknown error',
          });
        }
      }

      return {
        success: true,
        message: `Imported ${results.created} of ${results.total} coins`,
        results,
      };
    } catch (error: any) {
      throw new BadRequestException(`Failed to parse CSV: ${error.message}`);
    }
  }

  // ============================================
  // MEDIA MANAGER
  // ============================================

  /**
   * Upload multiple files to media manager
   */
  @Post('media/upload')
  @UseInterceptors(
    FilesInterceptor('files', 50, {
      storage: mediaStorage,
      // No file filter - accept any type
      // No size limit
    }),
  )
  async uploadMedia(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploaded = files.map((file) => {
      const stats = statSync(join(mediaUploadPath, file.filename));
      return {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: stats.size,
        url: `/api/uploads/media/${file.filename}`,
        uploadedAt: stats.birthtime,
      };
    });

    return {
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      files: uploaded,
    };
  }

  /**
   * List all files in media manager
   */
  @Get('media')
  async listMedia() {
    try {
      const files = readdirSync(mediaUploadPath);
      
      const mediaFiles = files
        .filter((filename) => !filename.startsWith('.')) // Exclude hidden files
        .map((filename) => {
          const filePath = join(mediaUploadPath, filename);
          const stats = statSync(filePath);
          const ext = extname(filename).toLowerCase();
          
          // Determine file type
          let type = 'file';
          const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
          const videoExts = ['.mp4', '.webm', '.mov', '.avi'];
          const audioExts = ['.mp3', '.wav', '.ogg'];
          const docExts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'];
          
          if (imageExts.includes(ext)) type = 'image';
          else if (videoExts.includes(ext)) type = 'video';
          else if (audioExts.includes(ext)) type = 'audio';
          else if (docExts.includes(ext)) type = 'document';

          return {
            filename,
            type,
            size: stats.size,
            url: `/api/uploads/media/${filename}`,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first

      return {
        success: true,
        files: mediaFiles,
        total: mediaFiles.length,
      };
    } catch (error) {
      return {
        success: true,
        files: [],
        total: 0,
      };
    }
  }

  /**
   * Get single file details
   */
  @Get('media/:filename')
  async getMediaFile(@Param('filename') filename: string) {
    const filePath = join(mediaUploadPath, filename);
    
    if (!existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    const stats = statSync(filePath);
    const ext = extname(filename).toLowerCase();
    
    // Determine file type
    let type = 'file';
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
    const videoExts = ['.mp4', '.webm', '.mov', '.avi'];
    
    if (imageExts.includes(ext)) type = 'image';
    else if (videoExts.includes(ext)) type = 'video';

    return {
      success: true,
      file: {
        filename,
        type,
        size: stats.size,
        url: `/api/uploads/media/${filename}`,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      },
    };
  }

  /**
   * Delete a file from media manager
   */
  @Delete('media/:filename')
  async deleteMediaFile(@Param('filename') filename: string) {
    const filePath = join(mediaUploadPath, filename);
    
    if (!existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    unlinkSync(filePath);

    return {
      success: true,
      message: 'File deleted successfully',
    };
  }
}

