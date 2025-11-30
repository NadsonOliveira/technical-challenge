import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { DocumentService } from './document.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerConfig } from 'src/config/multer.config';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chatbotId: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentDto,
  ) {
    return this.documentService.uploadPdf(file, body.chatbotId);
  }

  @Post(':id/process')
  processPdf(@Param('id') id: string) {
    return this.documentService.processPdf(id);
  }

  @Get('chatbot/:chatbotId')
  list(@Param('chatbotId') chatbotId: string) {
    return this.documentService.findByChatbot(chatbotId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }
}
