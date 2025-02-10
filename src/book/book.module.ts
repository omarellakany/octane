import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/data/entities/Book';
import { BookReadingInterval } from 'src/data/entities/BookReadingInterval';
import { UserModule } from 'src/user/user.module';
import { BookController } from './book.controller';
import { AddReadingIntervalHandler } from './handlers/add-reading-interval.handler';
import { GetBestFiveBooksHandler } from './handlers/get-best-five-books.handler';
import { DiscountMapper } from './mappers/book.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookReadingInterval]), UserModule],
  controllers: [BookController],
  providers: [
    DiscountMapper,
    AddReadingIntervalHandler,
    GetBestFiveBooksHandler,
  ],
})
export class BookModule {}
