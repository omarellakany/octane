import { IsString } from 'class-validator';

export class UpdateBookParams {
  @IsString()
  title: string;
}
