import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'ID do chatbot ao qual o documento está vinculado',
    example: '8d3e4b94-7d5c-4c87-b1fb-2f4b1c3da9a1',
  })
  @IsUUID()
  chatbotId: string;

  @ApiProperty({
    description: 'Nome original do arquivo enviado pelo usuário',
    example: 'contrato_empresa.pdf',
  })
  @IsString()
  originalName: string;

  @ApiProperty({
    description: 'Nome do arquivo salvo no servidor (gerado pelo sistema)',
    example: '1732818129384-contrato_empresa.pdf',
  })
  @IsString()
  filename: string;
}
