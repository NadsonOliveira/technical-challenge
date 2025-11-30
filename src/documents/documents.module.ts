import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentEntity } from './entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'documents'),
        filename: (_, file, callback) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          callback(null, `${unique}.${ext}`);
        },
      }),
    }),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
