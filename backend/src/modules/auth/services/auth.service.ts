import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { Role } from '../../../types/enums';
import { BadRequestError, UnauthorizedError } from '../../../utils/errors';
import { AuthRepository } from '../repositories/auth.repository';

const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }) {
    const existing = await this.authRepository.findByEmail(data.email);
    if (existing) {
      throw new BadRequestError('Email already registered');
    }

    const role = data.role ?? Role.BORROWER;
    if (role !== Role.BORROWER) {
      throw new BadRequestError('Public registration is only allowed for borrowers');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await this.authRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
    });

    const token = this.generateToken(user._id.toString(), user.email, user.role, user.name);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user._id.toString(), user.email, user.role, user.name);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  private generateToken(id: string, email: string, role: Role, name: string): string {
    return jwt.sign({ id, email, role, name }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }
}
