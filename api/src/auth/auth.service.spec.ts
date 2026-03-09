import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn(() => 'test-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('throws ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com' });

      await expect(service.register('Alice', 'a@b.com', 'pass')).rejects.toThrow(
        ConflictException,
      );
    });

    it('returns user without password on success', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ id: 1, name: 'Alice', email: 'a@b.com' });

      const result = await service.register('Alice', 'a@b.com', 'pass');

      expect(result).toEqual({ id: 1, name: 'Alice', email: 'a@b.com' });
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login('x@y.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('returns access_token on valid credentials', async () => {
      const hashed = await bcrypt.hash('pass', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com', password: hashed });

      const result = await service.login('a@b.com', 'pass');

      expect(result).toEqual({ access_token: 'test-token' });
    });
  });
});
