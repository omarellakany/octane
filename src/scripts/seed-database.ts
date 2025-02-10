import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { Book } from '../data/entities/Book';
import { Role, User } from '../data/entities/User';

export async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const userRepository = dataSource.getRepository(User);

    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@octane.com' },
    });

    if (!existingAdmin) {
      const admin = new User();
      admin.email = 'admin@octane.com';
      admin.password = await bcrypt.hash('admin123', 10);
      admin.name = 'Admin User';
      admin.role = Role.Admin;

      await userRepository.save(admin);
      console.log('✅ Admin user created');
    }

    const existingUser = await userRepository.findOne({
      where: { email: 'user@octane.com' },
    });

    if (!existingUser) {
      const user = new User();
      user.email = 'user@octane.com';
      user.password = await bcrypt.hash('user123', 10);
      user.name = 'User User';
      user.role = Role.User;

      await userRepository.save(user);
      console.log('✅ User user created');
    }

    const bookRepository = dataSource.getRepository(Book);

    const existingBooks = await bookRepository.count();

    if (existingBooks === 0) {
      const books: Book[] = [
        {
          id: 1,
          title: 'The Great Gatsby',
          numOfPages: 180,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: '1984',
          numOfPages: 328,
          createdAt: new Date(),
        },
        {
          id: 3,
          title: 'Pride and Prejudice',
          numOfPages: 279,
          createdAt: new Date(),
        },
        {
          id: 4,
          title: 'To Kill a Mockingbird',
          numOfPages: 324,
          createdAt: new Date(),
        },
        {
          id: 5,
          title: 'The Catcher in the Rye',
          numOfPages: 277,
          createdAt: new Date(),
        },
        {
          id: 6,
          title: 'One Hundred Years of Solitude',
          numOfPages: 417,
          createdAt: new Date(),
        },
        {
          id: 7,
          title: 'The Hobbit',
          numOfPages: 320,
          createdAt: new Date(),
        },
        {
          id: 8,
          title: 'Brave New World',
          numOfPages: 288,
          createdAt: new Date(),
        },
        {
          id: 9,
          title: 'The Lord of the Flies',
          numOfPages: 224,
          createdAt: new Date(),
        },
        {
          id: 10,
          title: 'Don Quixote',
          numOfPages: 1056,
          createdAt: new Date(),
        },
      ];

      for (const bookData of books) {
        const book = bookRepository.create(bookData);
        await bookRepository.save(book);
      }

      console.log('✅ Sample books created');
    }

    console.log('✅ Seed completed');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await app.close();
  }
}
