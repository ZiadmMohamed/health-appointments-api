import { setSeederFactory } from 'typeorm-extension';
import { usersData } from './data';
import { User } from '@app/user';

let userCount = 0;

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();
  Object.assign(user, usersData[userCount++]);
  return user;
});
