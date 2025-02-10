import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { Book } from 'src/data/entities/Book';
import { User } from 'src/data/entities/User';
import { RequestUser } from 'src/user/decorators/request-user.decorator';
import { AddReadingIntervalCommand } from './handlers/add-reading-interval.handler';
import { GetBestFiveBooksQuery } from './handlers/get-best-five-books.handler';
import { UpdateBookCommand } from './handlers/update-book.handler';
import { RankedBookModel } from './models/book-reading-interval.model';
import { BookModel } from './models/book.model';
import { AddReadingIntervalParams } from './params/add-reading-interval.params';
import { UpdateBookParams } from './params/update-book.params';

@Controller('books')
export class BookController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  @ApiResponse({ type: BookModel })
  @Post('reading-intervals')
  async addReadingInterval(
    @RequestUser() user: User,
    @Body() params: AddReadingIntervalParams,
  ) {
    await this.commandBus.execute(
      new AddReadingIntervalCommand(user.id, params),
    );
    return {
      status_code: 'success',
    };
  }

  @ApiResponse({ type: RankedBookModel, isArray: true })
  @Get('best-five')
  async getBestFiveBooks() {
    const books = await this.queryBus.execute(new GetBestFiveBooksQuery());
    return books;
  }

  @ApiResponse({ type: BookModel })
  @UseGuards(AdminGuard)
  @Patch(':id')
  async updateBook(@Param('id') id: number, @Body() params: UpdateBookParams) {
    const book = await this.commandBus.execute(
      new UpdateBookCommand(id, params),
    );
    return this.mapper.map(book, Book, BookModel);
  }
}
