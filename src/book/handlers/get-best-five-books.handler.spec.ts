import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../data/entities/Book';
import { BookReadingInterval } from '../../data/entities/BookReadingInterval';
import { GetBestFiveBooksHandler } from './get-best-five-books.handler';

describe('GetBestFiveBooksHandler', () => {
  let handler: GetBestFiveBooksHandler;
  let bookRepository: Repository<Book>;
  let readingIntervalRepository: Repository<BookReadingInterval>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetBestFiveBooksHandler,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BookReadingInterval),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<GetBestFiveBooksHandler>(GetBestFiveBooksHandler);
    bookRepository = moduleRef.get<Repository<Book>>(getRepositoryToken(Book));
    readingIntervalRepository = moduleRef.get<Repository<BookReadingInterval>>(
      getRepositoryToken(BookReadingInterval),
    );
  });

  it('should return ranked books when data exists', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        { intervalBookId: 1, totalPagesRead: 100 },
        { intervalBookId: 2, totalPagesRead: 50 },
      ]),
    };

    const mockBooks = [
      { id: 1, title: 'Book 1', numOfPages: 200 },
      { id: 2, title: 'Book 2', numOfPages: 150 },
    ] as Book[];

    jest
      .spyOn(readingIntervalRepository, 'createQueryBuilder')
      .mockReturnValue(mockQueryBuilder as any);
    jest.spyOn(bookRepository, 'findBy').mockResolvedValue(mockBooks);

    const result = await handler.execute();

    expect(result).toHaveLength(2);
    expect(result[0].bookId).toBe(1);
    expect(result[0].numOfReadPages).toBe(100);
    expect(result[1].bookId).toBe(2);
    expect(result[1].numOfReadPages).toBe(50);
  });

  it('should return empty array when no reading intervals exist', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    jest
      .spyOn(readingIntervalRepository, 'createQueryBuilder')
      .mockReturnValue(mockQueryBuilder as any);

    const result = await handler.execute();

    expect(result).toEqual([]);
    expect(bookRepository.findBy).not.toHaveBeenCalled();
  });
});
