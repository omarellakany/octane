import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';
import { AppEntity } from './AppEntity';

export enum Role {
  Admin = 'admin',
  User = 'user',
}

@Entity({ schema: 'user', name: 'profiles' })
export class User extends AppEntity {
  @AutoMap()
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @AutoMap()
  @Column({ type: 'enum', enum: Role })
  role: Role;
}
