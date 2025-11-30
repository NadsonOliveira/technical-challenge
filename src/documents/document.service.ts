import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';

import { CreateDocumentDto } from './dto/create-documents.dto';
import { DocumentEntity } from './entities/document.entity';

import { PDFParse, PasswordException } from 'pdf-parse';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
  ) {}

  async uploadPdf(file: Express.Multer.File, chatbotId: string) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('O arquivo deve ser um PDF.');
    }

    const dto: CreateDocumentDto = {
      chatbotId,
      originalName: file.originalname,
      filename: file.filename,
    };

    const document = this.documentRepo.create(dto);
    await this.documentRepo.save(document);

    return document;
  }

  async processPdf(documentId: string) {
    const document = await this.documentRepo.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado.');
    }

    const filePath = path.join(process.cwd(), 'uploads', document.filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Arquivo PDF não encontrado no servidor.');
    }

    const buffer = fs.readFileSync(filePath);

    const uint8Array = new Uint8Array(buffer);

    const parser = new PDFParse({ data: uint8Array });

    try {
      const result = await parser.getText();

      const extractedText = result.text;

      if (!extractedText || extractedText.trim().length === 0) {
        throw new BadRequestException(
          'Não foi possível extrair texto deste PDF.',
        );
      }

      document.textContent = extractedText;
      document.processed = true;
      await this.documentRepo.save(document);

      return {
        message: 'PDF processado com sucesso!',
        document,
      };
    } catch (error: unknown) {
      if (error instanceof PasswordException) {
        throw new BadRequestException(
          'Este PDF é protegido por senha e não pôde ser processado.',
        );
      }

      if (error instanceof Error) {
        console.error('Erro ao processar PDF:', error.message);
        throw new InternalServerErrorException(
          'Erro ao processar o arquivo PDF.',
        );
      }

      throw new InternalServerErrorException(
        'Erro desconhecido ao processar o PDF.',
      );
    } finally {
      await parser.destroy();
    }
  }

  async findByChatbot(chatbotId: string) {
    return this.documentRepo.find({
      where: { chatbotId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const document = await this.documentRepo.findOne({ where: { id } });
    if (!document) throw new NotFoundException('Documento não encontrado.');
    return document;
  }

  async remove(id: string) {
    const res = await this.documentRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Documento não encontrado.');
    return { message: 'Documento removido.' };
  }
}
