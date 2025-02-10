import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBookParams {
  @ApiProperty()
  @IsString()
  title: string;
}
