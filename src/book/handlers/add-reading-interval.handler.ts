import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../../data/entities/Book';
import { BookReadingInterval } from '../../data/entities/BookReadingInterval';
import { User } from '../../data/entities/User';
import { Repository } from 'typeorm';
import { AddReadingIntervalParams } from '../params/add-reading-interval.params';

export class AddReadingIntervalCommand {
  constructor(
    public readonly userId: number,
    public readonly params: AddReadingIntervalParams,
  ) {}
}

@CommandHandler(AddReadingIntervalCommand)
export class AddReadingIntervalHandler
  implements ICommandHandler<AddReadingIntervalCommand>
{
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BookReadingInterval)
    private readonly readingIntervalRepository: Repository<BookReadingInterval>,
  ) {}

  async execute(
    command: AddReadingIntervalCommand,
  ): Promise<BookReadingInterval> {
    const { userId, params } = command;
    const { bookId, startPage, endPage } = params;

    const [user, book] = await Promise.all([
      this.userRepository.findOneBy({ id: userId }),
      this.bookRepository.findOneBy({ id: bookId }),
    ]);

    if (!user || !book) {
      throw new Error('User or book not found');
    }

    if (startPage < 1 || endPage > book.numOfPages || startPage >= endPage) {
      throw new Error('Invalid page range');
    }

    const readingInterval = this.readingIntervalRepository.create({
      user,
      book,
      startPage,
      endPage,
    });

    await this.readingIntervalRepository.save(readingInterval);

    return readingInterval;
  }
}
