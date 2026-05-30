import { IUser, User } from '../../models/User';
import { Role } from '../../../types/enums';

export class AuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password');
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<IUser> {
    return User.create(data);
  }
}
