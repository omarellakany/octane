import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddReadingIntervalParams {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  startPage: number;

  @ApiProperty()
  @IsNumber()
  endPage: number;
}
