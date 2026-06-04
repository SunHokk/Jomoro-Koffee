import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({
      log: ['error'],
    });
  }

  get users() {
    return this.client.users;
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}