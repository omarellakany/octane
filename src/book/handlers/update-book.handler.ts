import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../data/entities/Book';
import { UpdateBookParams } from '../params/update-book.params';

export class UpdateBookCommand {
  constructor(
    public readonly bookId: number,
    public readonly params: UpdateBookParams,
  ) {}
}

@CommandHandler(UpdateBookCommand)
export class UpdateBookHandler implements ICommandHandler<UpdateBookCommand> {
  private readonly logger = new Logger(UpdateBookHandler.name);

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async execute(command: UpdateBookCommand): Promise<Book> {
    this.logger.debug(`Executing UpdateBookCommand for book ${command.bookId}`);

    const book = await this.bookRepository.findOneOrFail({
      where: { id: command.bookId },
    });

    book.title = command.params.title;

    await this.bookRepository.save(book);

    return book;
  }
}
