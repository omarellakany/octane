import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { AppModel } from 'src/common/models/app.model';

export class BookModel extends AppModel {
  @ApiProperty()
  @AutoMap()
  title: string;

  @ApiProperty()
  @AutoMap()
  numOfPages: number;
}
