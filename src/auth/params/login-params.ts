import { IsNotEmpty, IsString } from 'class-validator';

export class LoginParams {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
