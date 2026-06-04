"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = __importDefault(require("axios"));
const PRODUCT_SERVICE_URL = 'http://localhost:3002';
let TransactionService = class TransactionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
        if (!cart)
            return { cart_items: [] };
        const cartItems = await this.prisma.cart_items.findMany({
            where: { cart_id: cart.id },
        });
        const items = await Promise.all(cartItems.map(async (item) => {
            const product = await axios_1.default.get(`${PRODUCT_SERVICE_URL}/products/${item.product_id}`);
            return {
                product_id: item.product_id,
                name: product.data.name,
                price: product.data.price,
                quantity: item.quantity,
            };
        }));
        return { cart_items: items };
    }
    async addToCart(userId, dto) {
        const product = await axios_1.default.get(`${PRODUCT_SERVICE_URL}/products/${dto.product_id}`).catch(() => {
            throw new common_1.NotFoundException('Product not found');
        });
        if (dto.quantity > product.data.stock) {
            throw new common_1.BadRequestException('Quantity exceeds product stock');
        }
        let cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
        if (!cart) {
            cart = await this.prisma.carts.create({ data: { user_id: userId } });
        }
        const existingItem = await this.prisma.cart_items.findFirst({
            where: { cart_id: cart.id, product_id: dto.product_id },
        });
        if (existingItem) {
            throw new common_1.BadRequestException('Product already exists in cart');
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
    async updateCart(userId, productId, dto) {
        const product = await axios_1.default.get(`${PRODUCT_SERVICE_URL}/products/${productId}`).catch(() => {
            throw new common_1.NotFoundException('Product not found');
        });
        if (dto.quantity > product.data.stock) {
            throw new common_1.BadRequestException('Quantity exceeds product stock');
        }
        const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        await this.prisma.cart_items.updateMany({
            where: { cart_id: cart.id, product_id: productId },
            data: { quantity: dto.quantity },
        });
        return { message: 'Cart updated successfully' };
    }
    async deleteCartItem(userId, productId) {
        const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        await this.prisma.cart_items.deleteMany({
            where: { cart_id: cart.id, product_id: productId },
        });
        return { message: 'Product removed from cart successfully' };
    }
    async clearCart(userId) {
        const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        await this.prisma.cart_items.deleteMany({ where: { cart_id: cart.id } });
        return { message: 'Cart cleared successfully' };
    }
    async getOrders(userId) {
        return this.prisma.orders.findMany({ where: { user_id: userId } });
    }
    async getOrderDetail(userId, orderId) {
        const order = await this.prisma.orders.findFirst({
            where: { id: orderId, user_id: userId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const orderDetails = await this.prisma.order_details.findMany({
            where: { order_id: orderId },
        });
        const items = await Promise.all(orderDetails.map(async (detail) => {
            const product = await axios_1.default.get(`${PRODUCT_SERVICE_URL}/products/${detail.product_id}`);
            return {
                product_id: detail.product_id,
                name: product.data.name,
                quantity: detail.quantity,
                price: detail.price,
            };
        }));
        return { order_id: orderId, items };
    }
    async getProfile(userId, token) {
        const response = await axios_1.default.get(`http://localhost:3001/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
    async checkout(userId) {
        const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
        if (!cart)
            throw new common_1.BadRequestException('Cart is empty');
        const cartItems = await this.prisma.cart_items.findMany({ where: { cart_id: cart.id } });
        if (cartItems.length === 0)
            throw new common_1.BadRequestException('Cart is empty');
        const order = await this.prisma.orders.create({ data: { user_id: userId } });
        for (const item of cartItems) {
            const product = await axios_1.default.get(`${PRODUCT_SERVICE_URL}/products/${item.product_id}`);
            await this.prisma.order_details.create({
                data: {
                    order_id: order.id,
                    product_id: item.product_id,
                    price: product.data.price,
                    quantity: item.quantity,
                },
            });
            await axios_1.default.post(`${PRODUCT_SERVICE_URL}/admin/products/${item.product_id}/reduce`, {
                quantity: item.quantity,
            });
        }
        await this.prisma.cart_items.deleteMany({ where: { cart_id: cart.id } });
        return { message: 'Checkout successful', order_id: order.id };
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map