import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { Book } from './Book';
import { User } from './User';

@Entity({ schema: 'book', name: 'reading_intervals' })
export class BookReadingInterval extends AppEntity {
  @AutoMap()
  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @AutoMap()
  @ManyToOne(() => Book)
  book: Book;

  @Column()
  bookId: number;

  @AutoMap()
  @Column()
  startPage: number;

  @AutoMap()
  @Column()
  endPage: number;
}
