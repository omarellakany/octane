import { DataSource } from 'typeorm';

export async function waitForDatabase(dataSource: DataSource) {
  let retries = 5;
  while (retries > 0) {
    try {
      await dataSource.initialize();
      console.log('Database connected successfully');
      return;
    } catch (error) {
      console.log(`Failed to connect to database. Retries left: ${retries}`);
      retries -= 1;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  throw new Error('Unable to connect to database');
}
