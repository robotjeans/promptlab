import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  Body,
  Headers,
  UseInterceptors,
  BadRequestException,
  Logger,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RagService } from './rag.service';

// Define the file type interface directly
interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('query')
export class RagController {
  private readonly logger = new Logger(RagController.name);
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_MIME_TYPES = ['application/pdf', 'text/plain'];

  constructor(private ragService: RagService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('document', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['application/pdf', 'text/plain'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new UnsupportedMediaTypeException(
              'Only PDF and TXT files are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  async handleQuery(
    @UploadedFile() file: UploadedFileType,
    @Body('question') question: string,
    @Headers('x-user-id') userId: string,
  ) {
    // Validate required fields
    if (!userId) {
      throw new BadRequestException('X-User-ID header is required');
    }
    if (!question?.trim()) {
      throw new BadRequestException('Question is required and cannot be empty');
    }
    if (!file) {
      throw new BadRequestException('Document file is required');
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new PayloadTooLargeException(
        `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    // Validate file type
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        'Only PDF and TXT files are allowed',
      );
    }

    // Use original filename from multer
    const fileName = file.originalname;

    this.logger.log(
      `Processing query for user ${userId}, file: ${fileName}, size: ${file.size} bytes`,
    );

    try {
      const result = await this.ragService.processAndQuery(
        userId,
        fileName,
        file.buffer,
        question,
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Query processing failed for user ${userId}`, error);
      throw new BadRequestException(
        `Failed to process query: ${(error as Error).message}`,
      );
    }
  }

  @Delete('cleanup')
  async cleanupDocuments(
    @Headers('x-user-id') userId: string,
    @Body('olderThanDays') olderThanDays?: number,
  ) {
    if (!userId) {
      throw new BadRequestException('X-User-ID header is required');
    }

    const days = olderThanDays && olderThanDays > 0 ? olderThanDays : 30;

    this.logger.log(
      `Cleaning up documents older than ${days} days for user ${userId}`,
    );

    try {
      await this.ragService.cleanupOldDocuments(userId, days);
      return {
        success: true,
        message: `Cleanup completed for documents older than ${days} days`,
      };
    } catch (error) {
      this.logger.error(`Cleanup failed for user ${userId}`, error);
      throw new BadRequestException(
        `Failed to cleanup documents: ${(error as Error).message}`,
      );
    }
  }
}
