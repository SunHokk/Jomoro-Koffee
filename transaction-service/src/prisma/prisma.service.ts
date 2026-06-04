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

  get carts() {
    return this.client.carts;
  }

  get cart_items() {
    return this.client.cart_items;
  }

  get orders() {
    return this.client.orders;
  }

  get order_details() {
    return this.client.order_details;
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}