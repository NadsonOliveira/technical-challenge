import { ApiProperty } from '@nestjs/swagger';

export class AskRagDto {
  @ApiProperty({ description: 'ID do documento para buscar os chunks' })
  documentId: string;

  @ApiProperty({ description: 'Pergunta do usuário' })
  question: string;
}
