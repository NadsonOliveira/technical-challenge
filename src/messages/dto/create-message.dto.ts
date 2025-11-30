import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsUUID()
  chatbotId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: ['user', 'system', 'assistant'] })
  @IsEnum(['user', 'system', 'assistant'])
  sender: 'user' | 'system' | 'assistant';

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isError?: boolean = false;
}
