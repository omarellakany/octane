import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from '../../data/entities/Book';
import { BookReadingInterval } from '../../data/entities/BookReadingInterval';
import { RankedBookModel } from '../models/book-reading-interval.model';

export class GetBestFiveBooksQuery {}

@QueryHandler(GetBestFiveBooksQuery)
export class GetBestFiveBooksHandler
  implements IQueryHandler<GetBestFiveBooksQuery>
{
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookReadingInterval)
    private readonly readingIntervalRepository: Repository<BookReadingInterval>,
  ) {}

  async execute(): Promise<RankedBookModel[]> {
    const booksWithReadPages = await this.readingIntervalRepository
      .createQueryBuilder('interval')
      .select('interval.bookId', 'intervalBookId')
      .addSelect('SUM(interval.endPage - interval.startPage)', 'totalPagesRead')
      .groupBy('interval.bookId')
      .orderBy('"totalPagesRead"', 'DESC')
      .limit(5)
      .getRawMany();

    if (!booksWithReadPages.length) {
      return [];
    }

    const booksIds = booksWithReadPages.map((b) => b.intervalBookId);
    const books = await this.bookRepository.findBy({
      id: In(booksIds),
    });

    books.sort((a, b) => {
      const aIndex = booksIds.indexOf(a.id);
      const bIndex = booksIds.indexOf(b.id);
      return aIndex - bIndex;
    });

    return books.map((book) => {
      const bookWithReadPages = booksWithReadPages.find(
        (b) => b.intervalBookId === book.id,
      );

      const rankedBook = new RankedBookModel();
      rankedBook.bookId = book.id;
      rankedBook.bookName = book.title;
      rankedBook.numOfPages = book.numOfPages;
      rankedBook.numOfReadPages =
        Number(bookWithReadPages?.totalPagesRead) || 0;
      return rankedBook;
    });
  }
}
