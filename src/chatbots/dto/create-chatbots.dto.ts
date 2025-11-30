import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatbotsDto {
  @ApiProperty({
    description: 'Crie uma descrição única para o chatbot',
    example: 'Chatbot de Atendimento ao Cliente',
  })
  @IsString()
  @IsNotEmpty()
  description?: string;
}
