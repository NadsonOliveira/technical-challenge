import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateChatbotDto {
  @IsString()
  @ApiProperty({
    example: 'SupportBot',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'A chatbot that assists users with customer support inquiries.',
  })
  description?: string;
}
