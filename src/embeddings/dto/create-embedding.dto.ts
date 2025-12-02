import { ApiProperty } from '@nestjs/swagger';

export class CreateEmbeddingDto {
  @ApiProperty({
    example: 'e3f8c1b2-9a4d-4fd0-a0f6-2f13a83d4b90',
    description: 'ID do documento que já teve o PDF processado',
  })
  documentId: string;

  @ApiProperty({
    example: 'Este é um texto de teste para gerar embeddings.',
    description: 'Texto extraído do PDF que será convertido em chunks',
  })
  text?: string;
}
