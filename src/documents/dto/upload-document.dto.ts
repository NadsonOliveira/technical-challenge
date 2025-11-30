import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({
    description: 'ID do chatbot ao qual o documento está vinculado',
    example: '8d3e4b94-7d5c-4c87-b1fb-2f4b1c3da9a1',
  })
  @IsUUID()
  chatbotId: string;
}
