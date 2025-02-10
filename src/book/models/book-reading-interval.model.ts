import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { AppModel } from '../../common/models/app.model';

export class RankedBookModel extends AppModel {
  @ApiProperty()
  @AutoMap()
  bookId: number;

  @ApiProperty()
  @AutoMap()
  bookName: string;

  @ApiProperty()
  @AutoMap()
  numOfPages: number;

  @ApiProperty()
  @AutoMap()
  numOfReadPages: number;
}
