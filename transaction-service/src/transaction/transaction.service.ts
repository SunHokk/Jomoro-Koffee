import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import axios from 'axios';

const PRODUCT_SERVICE_URL = 'http://localhost:3002';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // Get cart
  async getCart(userId: number) {
    const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
    if (!cart) return { cart_items: [] };

    const cartItems = await this.prisma.cart_items.findMany({
      where: { cart_id: cart.id },
    });

    const items = await Promise.all(
      cartItems.map(async (item) => {
        const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/${item.product_id}`);
        return {
          product_id: item.product_id,
          name: product.data.name,
          price: product.data.price,
          quantity: item.quantity,
        };
      }),
    );

    return { cart_items: items };
  }

  // Add to cart
  async addToCart(userId: number, dto: AddCartDto) {
    // Cek produk ada dan stoknya
    const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/${dto.product_id}`).catch(() => {
      throw new NotFoundException('Product not found');
    });

    if (dto.quantity > product.data.stock) {
      throw new BadRequestException('Quantity exceeds product stock');
    }

    // Cek cart user
    let cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
    if (!cart) {
      cart = await this.prisma.carts.create({ data: { user_id: userId } });
    }

    // Cek produk sudah ada di cart
    const existingItem = await this.prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: dto.product_id },
    });
    if (existingItem) {
      throw new BadRequestException('Product already exists in cart');
    }

    await this.prisma.cart_items.create({
      data: {
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
      },
    });

    return { message: 'Product added to cart successfully' };
  }

  // Update cart item
  async updateCart(userId: number, productId: number, dto: UpdateCartDto) {
    const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`).catch(() => {
      throw new NotFoundException('Product not found');
    });

    if (dto.quantity > product.data.stock) {
      throw new BadRequestException('Quantity exceeds product stock');
    }

    const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    await this.prisma.cart_items.updateMany({
      where: { cart_id: cart.id, product_id: productId },
      data: { quantity: dto.quantity },
    });

    return { message: 'Cart updated successfully' };
  }

  // Delete cart item
  async deleteCartItem(userId: number, productId: number) {
    const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    await this.prisma.cart_items.deleteMany({
      where: { cart_id: cart.id, product_id: productId },
    });

    return { message: 'Product removed from cart successfully' };
  }

  // Clear cart
  async clearCart(userId: number) {
    const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    await this.prisma.cart_items.deleteMany({ where: { cart_id: cart.id } });

    return { message: 'Cart cleared successfully' };
  }

  // Get orders
  async getOrders(userId: number) {
    return this.prisma.orders.findMany({ where: { user_id: userId } });
  }

  // Get order detail
  async getOrderDetail(userId: number, orderId: number) {
    const order = await this.prisma.orders.findFirst({
      where: { id: orderId, user_id: userId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const orderDetails = await this.prisma.order_details.findMany({
      where: { order_id: orderId },
    });

    const items = await Promise.all(
      orderDetails.map(async (detail) => {
        const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/${detail.product_id}`);
        return {
          product_id: detail.product_id,
          name: product.data.name,
          quantity: detail.quantity,
          price: detail.price,
        };
      }),
    );

    return { order_id: orderId, items };
  }

  // Get profile
  async getProfile(userId: number, token: string) {
    const response = await axios.get(`http://localhost:3001/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // Checkout
  async checkout(userId: number) {
    const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
    if (!cart) throw new BadRequestException('Cart is empty');

    const cartItems = await this.prisma.cart_items.findMany({ where: { cart_id: cart.id } });
    if (cartItems.length === 0) throw new BadRequestException('Cart is empty');

    // Buat order
    const order = await this.prisma.orders.create({ data: { user_id: userId } });

    // Buat order details dan update stok
    for (const item of cartItems) {
      const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/${item.product_id}`);

      await this.prisma.order_details.create({
        data: {
          order_id: order.id,
          product_id: item.product_id,
          price: product.data.price,
          quantity: item.quantity,
        },
      });

      // Update stok via Product Service
      await axios.post(`${PRODUCT_SERVICE_URL}/admin/products/${item.product_id}/reduce`, {
        quantity: item.quantity,
      });
    }

    // Clear cart
    await this.prisma.cart_items.deleteMany({ where: { cart_id: cart.id } });

    return { message: 'Checkout successful', order_id: order.id };
  }
}