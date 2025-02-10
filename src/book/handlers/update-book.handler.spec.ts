import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../data/entities/Book';
import { UpdateBookCommand, UpdateBookHandler } from './update-book.handler';

describe('UpdateBookHandler', () => {
  let handler: UpdateBookHandler;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateBookHandler,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOneOrFail: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<UpdateBookHandler>(UpdateBookHandler);
    bookRepository = moduleRef.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should successfully update a book', async () => {
    const mockBook = {
      id: 1,
      title: 'Old Title',
    } as Book;

    const updatedBook = {
      ...mockBook,
      title: 'New Title',
    };

    jest.spyOn(bookRepository, 'findOneOrFail').mockResolvedValue(mockBook);
    jest.spyOn(bookRepository, 'save').mockResolvedValue(updatedBook);

    const command = new UpdateBookCommand(1, { title: 'New Title' });
    const result = await handler.execute(command);

    expect(result.title).toBe('New Title');
    expect(bookRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(bookRepository.save).toHaveBeenCalled();
  });

  it('should throw error when book not found', async () => {
    jest
      .spyOn(bookRepository, 'findOneOrFail')
      .mockRejectedValue(new Error('Book not found'));

    const command = new UpdateBookCommand(1, { title: 'New Title' });

    await expect(handler.execute(command)).rejects.toThrow('Book not found');
  });
});
