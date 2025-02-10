import { AutoMap } from '@automapper/classes';
import { Column, Entity, Index } from 'typeorm';
import { AppEntity } from './AppEntity';

@Entity({ schema: 'book', name: 'books' })
export class Book extends AppEntity {
  @AutoMap()
  @Column()
  @Index()
  title: string;

  @AutoMap()
  @Column()
  numOfPages: number;
}
