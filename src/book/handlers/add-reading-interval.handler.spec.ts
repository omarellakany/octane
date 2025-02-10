import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '../../data/entities/Book';
import { BookReadingInterval } from '../../data/entities/BookReadingInterval';
import { User } from '../../data/entities/User';
import { Repository } from 'typeorm';
import {
  AddReadingIntervalCommand,
  AddReadingIntervalHandler,
} from './add-reading-interval.handler';

describe('AddReadingIntervalHandler', () => {
  let handler: AddReadingIntervalHandler;
  let bookRepository: Repository<Book>;
  let userRepository: Repository<User>;
  let readingIntervalRepository: Repository<BookReadingInterval>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AddReadingIntervalHandler,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BookReadingInterval),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<AddReadingIntervalHandler>(
      AddReadingIntervalHandler,
    );
    bookRepository = moduleRef.get<Repository<Book>>(getRepositoryToken(Book));
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    readingIntervalRepository = moduleRef.get<Repository<BookReadingInterval>>(
      getRepositoryToken(BookReadingInterval),
    );
  });

  it('should successfully create a reading interval', async () => {
    const mockUser = { id: 1 } as User;
    const mockBook = { id: 1, numOfPages: 200 } as Book;
    const mockInterval = {
      id: 1,
      startPage: 1,
      endPage: 50,
    } as BookReadingInterval;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(mockBook);
    jest
      .spyOn(readingIntervalRepository, 'create')
      .mockReturnValue(mockInterval);
    jest
      .spyOn(readingIntervalRepository, 'save')
      .mockResolvedValue(mockInterval);

    const command = new AddReadingIntervalCommand(1, {
      bookId: 1,
      startPage: 1,
      endPage: 50,
    });

    const result = await handler.execute(command);

    expect(result).toBe(mockInterval);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(readingIntervalRepository.create).toHaveBeenCalled();
    expect(readingIntervalRepository.save).toHaveBeenCalled();
  });

  it('should throw error when user not found', async () => {
    const mockBook = { id: 1, numOfPages: 200 } as Book;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(mockBook);

    const command = new AddReadingIntervalCommand(1, {
      bookId: 1,
      startPage: 1,
      endPage: 50,
    });

    await expect(handler.execute(command)).rejects.toThrow(
      'User or book not found',
    );
  });

  it('should throw error for invalid page range', async () => {
    const mockUser = { id: 1 } as User;
    const mockBook = { id: 1, numOfPages: 200 } as Book;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(mockBook);

    const command = new AddReadingIntervalCommand(1, {
      bookId: 1,
      startPage: 100,
      endPage: 50,
    });

    await expect(handler.execute(command)).rejects.toThrow(
      'Invalid page range',
    );
  });
});
