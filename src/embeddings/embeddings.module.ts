import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbeddingEntity } from './entities/embedding.entity';
import { EmbeddingService } from './embeddings.service';
import { EmbeddingController } from './embeddings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmbeddingEntity])],
  providers: [EmbeddingService],
  controllers: [EmbeddingController],
  exports: [EmbeddingService, TypeOrmModule],
})
export class EmbeddingModule {}
