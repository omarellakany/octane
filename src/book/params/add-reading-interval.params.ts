import { IsNumber } from 'class-validator';

export class AddReadingIntervalParams {
  @IsNumber()
  bookId: number;

  @IsNumber()
  startPage: number;

  @IsNumber()
  endPage: number;
}
